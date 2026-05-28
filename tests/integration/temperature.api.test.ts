import request from 'supertest';
import { createApp } from '../../src/infrastructure/http/app';
import { Router } from 'express';

describe('GET /temperature/capture', () => {
  it('returns a temperature reading', async () => {
    const fakeRouter = Router();

    fakeRouter.get('/capture', (_req, res) => {
      res.json({
        value: 25,
        state: 'WARM',
        timestamp: new Date(),
      });
    });

    const app = createApp(fakeRouter);

    const res = await request(app).get('/temperature/capture');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value');
    expect(res.body).toHaveProperty('state');
    expect(res.body).toHaveProperty('timestamp');
  });
});