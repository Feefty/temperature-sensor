import request from 'supertest';
import { GetTemperatureHistory } from '../../../src/application/GetTemperatureHistory';
import { ReadTemperature } from '../../../src/application/ReadTemperature';
import { UpdateThresholds } from '../../../src/application/UpdateThresholds';
import { TemperatureSensor } from '../../../src/domain/ports/TemperatureSensor';
import { Celsius } from '../../../src/domain/temperature/Celsius';
import { Thresholds } from '../../../src/domain/temperature/Thresholds';
import { createApp } from '../../../src/infrastructure/http/createApp';
import { InMemoryTemperatureHistoryRepository } from '../../../src/infrastructure/persistence/InMemoryTemperatureHistoryRepository';
import { InMemoryThresholdsRepository } from '../../../src/infrastructure/persistence/InMemoryThresholdsRepository';
import { FakeTemperatureSensor } from '../../fakes/FakeTemperatureSensor';

const RECORDED_AT = '2026-06-09T12:00:00.000Z';

const buildApp = (sensor: TemperatureSensor) => {
  const thresholdsRepo = new InMemoryThresholdsRepository(Thresholds.default());
  const historyRepo = new InMemoryTemperatureHistoryRepository(15);
  const clock = () => new Date(RECORDED_AT);

  return createApp({
    readTemperature: new ReadTemperature(sensor, thresholdsRepo, historyRepo, clock),
    getTemperatureHistory: new GetTemperatureHistory(historyRepo),
    updateThresholds: new UpdateThresholds(thresholdsRepo),
  });
};

describe('Temperature endpoints', () => {
  describe('GET /temperature', () => {
    it('returns the current reading with its classified state', async () => {
      const app = buildApp(new FakeTemperatureSensor(40));

      const response = await request(app).get('/temperature');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ celsius: 40, state: 'HOT', recordedAt: RECORDED_AT });
    });

    it('masks an unexpected sensor failure as 500 without leaking details', async () => {
      const failingSensor: TemperatureSensor = {
        read: (): Promise<Celsius> => Promise.reject(new Error('sensor offline')),
      };
      const app = buildApp(failingSensor);

      const response = await request(app).get('/temperature');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /temperature/history', () => {
    it('is empty before any reading is requested', async () => {
      const app = buildApp(new FakeTemperatureSensor(20));

      const response = await request(app).get('/temperature/history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ readings: [] });
    });

    it('returns the prior readings in chronological order', async () => {
      const sensor = new FakeTemperatureSensor(10);
      const app = buildApp(sensor);

      await request(app).get('/temperature'); // 10 -> COLD
      sensor.setNext(25);
      await request(app).get('/temperature'); // 25 -> WARM

      const response = await request(app).get('/temperature/history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        readings: [
          { celsius: 10, state: 'COLD', recordedAt: RECORDED_AT },
          { celsius: 25, state: 'WARM', recordedAt: RECORDED_AT },
        ],
      });
    });
  });
});
