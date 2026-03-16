import request from 'supertest';
import { createApp } from '../../src/infrastructure/http/app';
import { InMemoryHistoryRepository } from '../../src/infrastructure/persistence/in-memory-history-repository';
import { InMemoryThresholdsRepository } from '../../src/infrastructure/persistence/in-memory-thresholds-repository';
import { FakeTemperatureSensor } from '../../src/infrastructure/sensor/fake-temperature-sensor';

function buildTestApp() {
  const historyRepository = new InMemoryHistoryRepository();
  const thresholdsRepository = new InMemoryThresholdsRepository();
  const sensor = new FakeTemperatureSensor();

  const app = createApp({
    getTemperatureDeps: {
      getTemperatureFromSensor: () => sensor.read(),
      getThresholds: () => thresholdsRepository.get(),
      saveToHistory: (entry) => historyRepository.save(entry),
    },
    getHistoryDeps: {
      getLastEntries: (count) => historyRepository.getLast(count),
    },
    getThresholdsDeps: {
      getThresholds: () => thresholdsRepository.get(),
    },
    setThresholdsDeps: {
      setThresholds: (thresholds) => thresholdsRepository.set(thresholds),
    },
  });

  return app;
}

describe('Temperature API', () => {
  beforeEach(() => {
    process.env.FAKE_SENSOR_TEMPERATURE = '25';
  });

  it('GET /temperature returns 200 and expected fields', async () => {
    const app = buildTestApp();

    const response = await request(app).get('/temperature');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        temperature: expect.any(Number),
        state: expect.any(String),
        timestamp: expect.any(Number),
      }),
    );
  });

  it('GET /temperature/history returns 200 and items', async () => {
    const app = buildTestApp();

    await request(app).get('/temperature');
    const response = await request(app).get('/temperature/history');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
      }),
    );
  });

  it('history is limited to 15 items after many GET /temperature calls', async () => {
    const app = buildTestApp();

    for (let i = 0; i < 20; i += 1) {
      await request(app).get('/temperature');
    }

    const response = await request(app).get('/temperature/history');

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(15);
  });

  it('GET /temperature/thresholds returns 200 and default thresholds', async () => {
    const app = buildTestApp();

    const response = await request(app).get('/temperature/thresholds');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      coldMaxExclusive: 22,
      hotMinInclusive: 35,
    });
  });

  it('PUT /temperature/thresholds with valid values returns 200 and new values', async () => {
    const app = buildTestApp();

    const response = await request(app).put('/temperature/thresholds').send({
      coldMaxExclusive: 20,
      hotMinInclusive: 40,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      coldMaxExclusive: 20,
      hotMinInclusive: 40,
    });
  });

  it('PUT /temperature/thresholds with invalid thresholds returns 400', async () => {
    const app = buildTestApp();

    const response = await request(app).put('/temperature/thresholds').send({
      coldMaxExclusive: 35,
      hotMinInclusive: 35,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });
});
