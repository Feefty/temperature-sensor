import request from 'supertest';
import { GetTemperatureHistory } from '../../../src/application/GetTemperatureHistory';
import { ReadTemperature } from '../../../src/application/ReadTemperature';
import { UpdateThresholds } from '../../../src/application/UpdateThresholds';
import { Thresholds } from '../../../src/domain/temperature/Thresholds';
import { createApp } from '../../../src/infrastructure/http/createApp';
import { InMemoryTemperatureHistoryRepository } from '../../../src/infrastructure/persistence/InMemoryTemperatureHistoryRepository';
import { InMemoryThresholdsRepository } from '../../../src/infrastructure/persistence/InMemoryThresholdsRepository';
import { FakeTemperatureSensor } from '../../fakes/FakeTemperatureSensor';

const buildApp = (sensor: FakeTemperatureSensor) => {
  const thresholdsRepo = new InMemoryThresholdsRepository(Thresholds.default());
  const historyRepo = new InMemoryTemperatureHistoryRepository(15);
  const clock = () => new Date('2026-06-09T12:00:00.000Z');

  return createApp({
    readTemperature: new ReadTemperature(sensor, thresholdsRepo, historyRepo, clock),
    getTemperatureHistory: new GetTemperatureHistory(historyRepo),
    updateThresholds: new UpdateThresholds(thresholdsRepo),
  });
};

describe('PUT /thresholds', () => {
  it('updates the thresholds and echoes the new boundaries', async () => {
    const app = buildApp(new FakeTemperatureSensor(20));

    const response = await request(app).put('/thresholds').send({ cold: 10, hot: 40 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ cold: 10, hot: 40 });
  });

  it('changes how subsequent readings are classified (runtime reconfiguration)', async () => {
    const app = buildApp(new FakeTemperatureSensor(5));

    // 5°C is COLD under the defaults...
    const before = await request(app).get('/temperature');
    expect(before.body.state).toBe('COLD');

    await request(app).put('/thresholds').send({ cold: 0, hot: 10 });

    // ...and WARM once the cold boundary drops to 0.
    const after = await request(app).get('/temperature');
    expect(after.body.state).toBe('WARM');
  });

  it('rejects a rule violation (cold >= hot) with 400', async () => {
    const app = buildApp(new FakeTemperatureSensor(20));

    const response = await request(app).put('/thresholds').send({ cold: 40, hot: 10 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('must be less than');
  });

  it('rejects a malformed payload with 400', async () => {
    const app = buildApp(new FakeTemperatureSensor(20));

    const response = await request(app).put('/thresholds').send({ cold: '10', hot: 40 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('must be numbers');
  });
});
