import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TemperatureSensorPort } from '../../application/ports/temperature-sensor.port';
import { TemperatureModule } from '../../temperature.module';
import { TEMPERATURE_SENSOR_PORT } from '../../temperature.tokens';

type HttpResult = Readonly<{
  status: number;
  body: unknown;
}>;

async function sendJsonRequest(
  baseUrl: string,
  path: string,
  method: 'GET' | 'POST' | 'PATCH',
  body: object | undefined,
): Promise<HttpResult> {
  const response: Response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

describe('Temperature HTTP interface', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeEach(async (): Promise<void> => {
    const sensor: TemperatureSensorPort = {
      readTemperature: jest.fn<Promise<number>, []>().mockResolvedValue(36.2),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [TemperatureModule],
    })
      .overrideProvider(TEMPERATURE_SENSOR_PORT)
      .useValue(sensor)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(0, '127.0.0.1');
    baseUrl = await app.getUrl();
  });

  afterEach(async (): Promise<void> => {
    await app.close();
  });

  it('captures a temperature and returns 201 with an ISO timestamp', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/temperature-requests',
      'POST',
      undefined,
    );

    expect(result.status).toBe(201);
    expect(result.body).toEqual({
      id: expect.any(String),
      temperature: 36.2,
      state: 'HOT',
      thresholds: { coldThreshold: 22, hotThreshold: 35 },
      capturedAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
    });
  });

  it('returns temperature history metadata', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/temperature-requests',
      'GET',
      undefined,
    );

    expect(result).toEqual({
      status: 200,
      body: { items: [], count: 0, maxSize: 15 },
    });
  });

  it('returns the active thresholds', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'GET',
      undefined,
    );

    expect(result).toEqual({
      status: 200,
      body: { coldThreshold: 22, hotThreshold: 35 },
    });
  });

  it('accepts a partial threshold update', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'PATCH',
      { hotThreshold: 32 },
    );

    expect(result).toEqual({
      status: 200,
      body: { coldThreshold: 22, hotThreshold: 32 },
    });
  });

  it('rejects an empty threshold update', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'PATCH',
      {},
    );

    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      statusCode: 400,
      message: 'At least one threshold must be provided',
      error: 'Bad Request',
    });
  });

  it('rejects a non-numeric threshold', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'PATCH',
      { hotThreshold: 'warm' },
    );

    expect(result.status).toBe(400);
  });

  it('rejects a null threshold', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'PATCH',
      { hotThreshold: null },
    );

    expect(result.status).toBe(400);
  });

  it('rejects an invalid merged threshold range', async (): Promise<void> => {
    const result: HttpResult = await sendJsonRequest(
      baseUrl,
      '/thresholds',
      'PATCH',
      { hotThreshold: 23 },
    );

    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      statusCode: 400,
      message:
        'hotThreshold must be at least 2 greater than coldThreshold; received coldThreshold=22, hotThreshold=23',
      error: 'Bad Request',
    });
  });
});
