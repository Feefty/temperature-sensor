import request from 'supertest';
import { createApp } from '../../src/infrastructure/http/createApp';
import { InMemoryReadingRepository } from '../../src/infrastructure/repositories/InMemoryReadingRepository';
import { FakeTemperatureSensor } from '../fakes/FakeTemperatureSensor';
import { DomainError } from '../../src/domain/errors/DomainError';
import type { TemperatureSensor } from '../../src/domain/ports/TemperatureSensor';

function appWith(sensor: TemperatureSensor) {
  return createApp({ sensor, repository: new InMemoryReadingRepository() });
}

describe('Temperature API', () => {
  it('GET /api/v1/temperature returns a classified reading', async () => {
    const res = await request(appWith(new FakeTemperatureSensor(25))).get('/api/v1/temperature');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ temperature: 25, state: 'WARM' });
    expect(typeof res.body.capturedAt).toBe('string');
  });

  it.each([
    [21.9, 'COLD'],
    [22.0, 'WARM'],
    [35.0, 'HOT'],
  ])('classifies %p as %s over HTTP', async (celsius, state) => {
    const res = await request(appWith(new FakeTemperatureSensor(celsius))).get(
      '/api/v1/temperature',
    );
    expect(res.body.state).toBe(state);
  });

  it('GET /api/v1/temperature/history is empty, then accumulates and caps at 15', async () => {
    const app = appWith(new FakeTemperatureSensor(25));
    expect((await request(app).get('/api/v1/temperature/history')).body).toEqual([]);

    for (let i = 0; i < 20; i += 1) {
      await request(app).get('/api/v1/temperature');
    }

    const res = await request(app).get('/api/v1/temperature/history');
    expect(res.body).toHaveLength(15);
  });

  it('PUT /api/v1/thresholds updates thresholds and reclassifies future readings', async () => {
    const app = appWith(new FakeTemperatureSensor(25));
    expect((await request(app).get('/api/v1/temperature')).body.state).toBe('WARM');

    const put = await request(app).put('/api/v1/thresholds').send({ coldMax: 10, hotMin: 20 });
    expect(put.status).toBe(200);
    expect(put.body).toEqual({ coldMax: 10, hotMin: 20 });

    expect((await request(app).get('/api/v1/temperature')).body.state).toBe('HOT');
  });

  it('PUT /api/v1/thresholds rejects cold >= hot with 422', async () => {
    const res = await request(appWith(new FakeTemperatureSensor(25)))
      .put('/api/v1/thresholds')
      .send({ coldMax: 30, hotMin: 30 });

    expect(res.status).toBe(422);
  });

  it.each([{ coldMax: 'x', hotMin: 35 }, { coldMax: 22 }, {}])(
    'PUT /api/v1/thresholds rejects malformed body %p with 400',
    async (body) => {
      const res = await request(appWith(new FakeTemperatureSensor(25)))
        .put('/api/v1/thresholds')
        .send(body);
      expect(res.status).toBe(400);
    },
  );

  it('PUT /api/v1/thresholds rejects a non-finite number with 400', async () => {
    const res = await request(appWith(new FakeTemperatureSensor(25)))
      .put('/api/v1/thresholds')
      .set('Content-Type', 'application/json')
      .send('{"coldMax": 1e400, "hotMin": 35}');

    expect(res.status).toBe(400);
  });

  it('returns 400 when the sensor yields an invalid reading', async () => {
    const sensor: TemperatureSensor = {
      read: () => Promise.reject(new DomainError('invalid reading')),
    };
    const res = await request(appWith(sensor)).get('/api/v1/temperature');

    expect(res.status).toBe(400);
  });

  it('returns 500 when the sensor fails unexpectedly', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const sensor: TemperatureSensor = { read: () => Promise.reject(new Error('hardware fault')) };

    const res = await request(appWith(sensor)).get('/api/v1/temperature');

    expect(res.status).toBe(500);
    errorSpy.mockRestore();
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(appWith(new FakeTemperatureSensor(25))).get('/api/v1/unknown');
    expect(res.status).toBe(404);
  });
});
