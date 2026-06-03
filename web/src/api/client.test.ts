import { http, HttpResponse } from 'msw';
import { api, ApiError } from '@/api';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';

describe('api client', () => {
  it('reads the current temperature and parses capturedAt to a Date', async () => {
    server.use(
      http.get(`${BASE}/temperature`, () =>
        HttpResponse.json({
          temperature: 24.3,
          state: 'WARM',
          capturedAt: '2026-05-31T10:00:00.000Z',
        }),
      ),
    );

    const reading = await api.getTemperature();
    expect(reading.temperature).toBe(24.3);
    expect(reading.state).toBe('WARM');
    expect(reading.capturedAt).toBeInstanceOf(Date);
    expect(reading.capturedAt.toISOString()).toBe('2026-05-31T10:00:00.000Z');
  });

  it('reads the history as parsed readings', async () => {
    server.use(
      http.get(`${BASE}/temperature/history`, () =>
        HttpResponse.json([
          { temperature: 30, state: 'WARM', capturedAt: '2026-05-31T10:00:00.000Z' },
        ]),
      ),
    );

    const history = await api.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]?.capturedAt).toBeInstanceOf(Date);
  });

  it('returns an empty history when there are no readings', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json([])));

    await expect(api.getHistory()).resolves.toEqual([]);
  });

  it('redefines thresholds via PUT and returns them', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    );

    await expect(api.redefineThresholds({ coldMax: 10, hotMin: 20 })).resolves.toEqual({
      coldMax: 10,
      hotMin: 20,
    });
  });

  it('throws an ApiError carrying the status and the server message', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, () =>
        HttpResponse.json({ error: 'coldMax must be strictly less than hotMin' }, { status: 422 }),
      ),
    );

    const error = await api
      .redefineThresholds({ coldMax: 30, hotMin: 30 })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      message: 'coldMax must be strictly less than hotMin',
    });
  });

  it('falls back to the status when the error response has no JSON body', async () => {
    server.use(http.get(`${BASE}/temperature`, () => new HttpResponse(null, { status: 500 })));

    const error = await api.getTemperature().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, message: 'Request failed with status 500' });
  });
});
