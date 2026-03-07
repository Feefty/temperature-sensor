const request = require('supertest');
const app = require('../../src/app');
const { setThresholds } = require('../../src/domain/entities/SensorState');

describe('Temperature API', () => {
  beforeEach(() => setThresholds({ hot: 35, cold: 22 }));

  test('GET /api/temperature returns a reading with temperature and state', async () => {
    const res = await request(app).get('/api/temperature');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('state');
    expect(['HOT', 'WARM', 'COLD']).toContain(res.body.state);
  });

  test('GET /api/temperature/history returns array of max 15', async () => {
    for (let i = 0; i < 5; i++) await request(app).get('/api/temperature');
    const res = await request(app).get('/api/temperature/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(15);
  });

  test('PATCH /api/temperature/thresholds updates successfully', async () => {
    const res = await request(app)
      .patch('/api/temperature/thresholds')
      .send({ hot: 40, cold: 18 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hot: 40, cold: 18 });
  });

  test('PATCH /api/temperature/thresholds returns 400 for invalid input', async () => {
    const res = await request(app)
      .patch('/api/temperature/thresholds')
      .send({ hot: 10, cold: 25 });
    expect(res.status).toBe(400);
  });
});