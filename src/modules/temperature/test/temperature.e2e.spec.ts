import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Logger } from '@shared/common/logger/logger.service';
import { truncateTables } from '@shared/common/test/e2e/database.util';
import { DatabaseTestService } from '@shared/common/test/e2e/database-test.service';
import { TemperatureTestService } from '@shared/common/test/temperature-test.service';
import { createTemperatureE2eApplication, TemperatureE2eContext } from '../../../test/e2e/e2e-bootstrap';
import { TemperatureState } from '@modules/temperature/domain/temperature-state.enum';
import { TemperatureErrors } from '../domain/errors/temperature.errors';
import { UpdateThresholdsMock, createThresholdsMock } from './mocks/temperature.mock';
import { SensorThresholdsEntity } from '../infrastructure/persistence/temperature-threshold.entity';
import { TemperatureHistoryEntity } from '../infrastructure/persistence/temperature-history.entity';
import { TemperatureHistoryResponseDto } from '../presentation/dto/temperature-history-response.dto';
import { ConfigSensorModel } from '@shared/config/models/config-sensor.model';

const BASE: string = '/api/v1/temperature';

describe('Temperature E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let testService: TemperatureTestService;
  let databaseTestService: DatabaseTestService;
  let logger: Logger;
  let thresholdSingletonKey: number;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  afterAll(async () => {
    await app.close();
  });

  beforeAll(async () => {
    const context: TemperatureE2eContext = await createTemperatureE2eApplication();
    app = context.app;
    dataSource = context.dataSource;
    testService = context.testService;
    databaseTestService = context.databaseTestService;
    logger = context.moduleRef.get<Logger>(Logger);
    thresholdSingletonKey = context.moduleRef
      .get<ConfigService>(ConfigService)
      .getOrThrow<ConfigSensorModel>('sensor').thresholdSingletonKey;

    loggerWarnSpy = jest.spyOn(logger, 'warn');
    loggerErrorSpy = jest.spyOn(logger, 'error');
  });

  beforeEach(async () => {
    await truncateTables(dataSource);
    await testService.ensureSingletonThresholds(22, 35);
    loggerWarnSpy.mockClear();
    loggerErrorSpy.mockClear();
  });

  describe(`GET ${BASE}/current`, () => {
    it('200 OK - returns celsius, state and capturedAt in response', async () => {
      const res: request.Response = await getCurrent().expect(HttpStatus.OK);

      expect(typeof res.body.celsius).toBe('number');
      expect(Object.values(TemperatureState)).toContain(res.body.state);
      expect(res.body.capturedAt).toBeDefined();
    });

    it('200 OK - persists exactly one row in temperature_history', async () => {
      await getCurrent().expect(HttpStatus.OK);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').run();
      expect(temperatureHistoryEntities).toHaveLength(1);
      expect(temperatureHistoryEntities[0]).toEqual({
        rowId: expect.any(String),
        capturedAt: expect.any(Date),
        celsius: expect.any(String),
        state: expect.stringMatching(new RegExp(`^(${Object.values(TemperatureState).join('|')})$`)),
        snapshotColdBelow: '22.00',
        snapshotHotFrom: '35.00',
      });
    });

    it('200 OK - row in history matches the API response exactly', async () => {
      const res: request.Response = await getCurrent().expect(HttpStatus.OK);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').orderBy('capturedAt', 'DESC').run();
      expect(temperatureHistoryEntities).toHaveLength(1);
      expect(Number.parseFloat(temperatureHistoryEntities[0].celsius)).toBe(res.body.celsius);
      expect(temperatureHistoryEntities[0].state).toBe(res.body.state);
      expect(new Date(temperatureHistoryEntities[0].capturedAt).toISOString()).toBe(res.body.capturedAt);
    });

    it('200 OK - snapshot_cold_below and snapshot_hot_from reflect active thresholds', async () => {
      await testService.resetThresholds(10, 30);
      await getCurrent().expect(HttpStatus.OK);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').run();
      expect(temperatureHistoryEntities).toHaveLength(1);
      expect(temperatureHistoryEntities[0].snapshotColdBelow).toBe('10.00');
      expect(temperatureHistoryEntities[0].snapshotHotFrom).toBe('30.00');
    });

    it('200 OK - each call appends one row; three calls produce three rows', async () => {
      await getCurrent().expect(HttpStatus.OK);
      await getCurrent().expect(HttpStatus.OK);
      await getCurrent().expect(HttpStatus.OK);

      const count: number = await databaseTestService.getFrom('temperature_history').count();
      expect(count).toBe(3);
    });

    it('200 OK - classifies HOT when cold/hot bounds are both below sensor range', async () => {
      await testService.resetThresholds(-273, -100);
      const res: request.Response = await getCurrent().expect(HttpStatus.OK);
      expect(res.body.state).toBe(TemperatureState.HOT);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').run();
      expect(temperatureHistoryEntities[0].state).toBe(TemperatureState.HOT);
    });

    it('200 OK - classifies COLD when cold/hot bounds are both above sensor range', async () => {
      await testService.resetThresholds(1000, 1001);
      const res: request.Response = await getCurrent().expect(HttpStatus.OK);
      expect(res.body.state).toBe(TemperatureState.COLD);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').run();
      expect(temperatureHistoryEntities[0].state).toBe(TemperatureState.COLD);
    });

    it('200 OK - classifies WARM when bounds straddle sensor range (14 / 41)', async () => {
      await testService.resetThresholds(14, 41);
      const res: request.Response = await getCurrent().expect(HttpStatus.OK);
      expect(res.body.state).toBe(TemperatureState.WARM);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').run();
      expect(temperatureHistoryEntities[0].state).toBe(TemperatureState.WARM);
    });

    it('404 NOT_FOUND - returns error code when thresholds singleton is missing', async () => {
      await testService.deleteThresholdSingleton();
      const res: request.Response = await getCurrent().expect(HttpStatus.NOT_FOUND);
      expect(res.body.code).toBe(TemperatureErrors.THRESHOLDS_NOT_FOUND(String(thresholdSingletonKey)).code);

      const count: number = await databaseTestService.getFrom('temperature_history').count();
      expect(count).toBe(0);
    });
  });

  describe(`GET ${BASE}/history`, () => {
    it('200 OK - returns empty array when no temperature histories exist', async () => {
      const res: request.Response = await getHistory().expect(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });

    it('200 OK - returns all seeded temperature histories ordered oldest-first', async () => {
      await getCurrent().expect(HttpStatus.OK);
      await getCurrent().expect(HttpStatus.OK);
      await getCurrent().expect(HttpStatus.OK);

      const res: request.Response = await getHistory().expect(HttpStatus.OK);
      expect(res.body).toHaveLength(3);

      const temperatureHistoryEntities: TemperatureHistoryEntity[] = await databaseTestService.getFrom('temperature_history').orderBy('capturedAt', 'ASC').run();
      expect(temperatureHistoryEntities).toHaveLength(3);

      const apiDates: number[] = res.body.map((r: { capturedAt: string }) => new Date(r.capturedAt).getTime());
      expect(apiDates).toEqual([...apiDates].sort((a, b) => a - b));
    });

    it('200 OK - caps response at 15 even when 18 rows exist in database', async () => {
      for (let i = 0; i < 18; i++) {
        await getCurrent().expect(HttpStatus.OK);
      }

      const count: number = await databaseTestService.getFrom('temperature_history').count();
      expect(count).toBe(18);

      const res: request.Response = await getHistory().expect(HttpStatus.OK);
      expect(res.body).toHaveLength(15);
    });

    it('200 OK - each item has celsius, state, capturedAt, snapshotColdBelow, snapshotHotFrom', async () => {
      await getCurrent().expect(HttpStatus.OK);
      const res: request.Response = await getHistory().expect(HttpStatus.OK);

      const temperatureHistoryResponse: TemperatureHistoryResponseDto = res.body[0];
      expect(typeof temperatureHistoryResponse.celsius).toBe('number');
      expect(Object.values(TemperatureState)).toContain(temperatureHistoryResponse.state);
      expect(temperatureHistoryResponse.capturedAt).toBeDefined();
      expect(typeof temperatureHistoryResponse.snapshotColdBelow).toBe('number');
      expect(typeof temperatureHistoryResponse.snapshotHotFrom).toBe('number');
    });

    it('200 OK - returns empty array when thresholds row is missing (history is independent)', async () => {
      await testService.deleteThresholdSingleton();
      const res: request.Response = await getHistory().expect(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });
  });

  describe(`GET ${BASE}/thresholds`, () => {
    it('200 OK - returns the active thresholds from database', async () => {
      const sensorThresholdEntity: SensorThresholdsEntity | undefined = await databaseTestService.getFrom('sensor_thresholds').getOne();
      expect(sensorThresholdEntity).toBeDefined();

      expect(sensorThresholdEntity).toEqual({
        singletonKey: thresholdSingletonKey,
        coldBelowCelsius: '22.00',
        hotFromCelsius: '35.00',
        updatedAt: expect.any(Date),
      });

      const res: request.Response = await getThresholds().expect(HttpStatus.OK);
      expect(res.body.coldBelowCelsius).toBe(Number.parseFloat(sensorThresholdEntity!.coldBelowCelsius));
      expect(res.body.hotFromCelsius).toBe(Number.parseFloat(sensorThresholdEntity!.hotFromCelsius));
    });

    it('200 OK - response reflects updated values after a PUT', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 15, hotFromCelsius: 40 });
      await putThresholds(updateThresholdsMock).expect(HttpStatus.OK);

      const res: request.Response = await getThresholds().expect(HttpStatus.OK);
      expect(res.body.coldBelowCelsius).toBe(15);
      expect(res.body.hotFromCelsius).toBe(40);
    });

    it('404 NOT_FOUND - returns error code when singleton row is missing', async () => {
      await testService.deleteThresholdSingleton();

      const count: number = await databaseTestService.getFrom('sensor_thresholds').count();
      expect(count).toBe(0);

      const res: request.Response = await getThresholds().expect(HttpStatus.NOT_FOUND);
      expect(res.body.code).toBe(TemperatureErrors.THRESHOLDS_NOT_FOUND(String(thresholdSingletonKey)).code);
    });
  });

  describe(`PUT ${BASE}/thresholds`, () => {
    it('200 OK - updates thresholds row in database and returns new values', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 18, hotFromCelsius: 38 });

      const res: request.Response = await putThresholds(updateThresholdsMock).expect(HttpStatus.OK);
      expect(res.body.coldBelowCelsius).toBe(18);
      expect(res.body.hotFromCelsius).toBe(38);

      const sensorThresholdEntity: SensorThresholdsEntity | undefined = await databaseTestService.getFrom('sensor_thresholds').getOne();
      expect(sensorThresholdEntity).toEqual({
        singletonKey: thresholdSingletonKey,
        coldBelowCelsius: '18.00',
        hotFromCelsius: '38.00',
        updatedAt: expect.any(Date),
      });
    });

    it('200 OK - updated_at is refreshed on each PUT', async () => {
      const sensorThresholdEntityBefore: SensorThresholdsEntity | undefined = await databaseTestService.getFrom('sensor_thresholds').getOne();
      expect(sensorThresholdEntityBefore).toBeDefined();

      await new Promise((r) => setTimeout(r, 10));
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 5, hotFromCelsius: 25 });
      await putThresholds(updateThresholdsMock).expect(HttpStatus.OK);

      const sensorThresholdEntityAfter: SensorThresholdsEntity | undefined = await databaseTestService.getFrom('sensor_thresholds').getOne();
      expect(sensorThresholdEntityAfter).toBeDefined();
      expect(new Date(sensorThresholdEntityAfter!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(sensorThresholdEntityBefore!.updatedAt).getTime()
      );
    });

    it('400 BAD_REQUEST - rejects coldBelowCelsius >= hotFromCelsius and logs a warn', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 35, hotFromCelsius: 35 });

      const res: request.Response = await putThresholds(updateThresholdsMock).expect(HttpStatus.BAD_REQUEST);
      expect(res.body.code).toBe(TemperatureErrors.VALIDATION_ERROR('').code);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('coldBelowCelsius'),
        expect.objectContaining({ coldBelowCelsius: 35, hotFromCelsius: 35 })
      );

      const sensorThresholdEntity: SensorThresholdsEntity | undefined = await databaseTestService.getFrom('sensor_thresholds').getOne();
      expect(sensorThresholdEntity).toBeDefined();
      expect(sensorThresholdEntity!.coldBelowCelsius).toBe('22.00');
      expect(sensorThresholdEntity!.hotFromCelsius).toBe('35.00');
    });

    it('400 BAD_REQUEST - rejects coldBelowCelsius > hotFromCelsius', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 40, hotFromCelsius: 20 });
      const res: request.Response = await putThresholds(updateThresholdsMock).expect(HttpStatus.BAD_REQUEST);
      expect(res.body.code).toBe(TemperatureErrors.VALIDATION_ERROR('').code);
    });

    it('400 BAD_REQUEST - rejects body missing hotFromCelsius', async () => {
      await putThresholds({ coldBelowCelsius: 20 }).expect(HttpStatus.BAD_REQUEST);
    });

    it('400 BAD_REQUEST - rejects body missing coldBelowCelsius', async () => {
      await putThresholds({ hotFromCelsius: 40 }).expect(HttpStatus.BAD_REQUEST);
    });

    it('400 BAD_REQUEST - rejects non-numeric values', async () => {
      await putThresholds({ coldBelowCelsius: 'warm', hotFromCelsius: 'hot' }).expect(HttpStatus.BAD_REQUEST);
    });

    it('400 BAD_REQUEST - rejects unknown properties (forbidNonWhitelisted)', async () => {
      await putThresholds({ coldBelowCelsius: 10, hotFromCelsius: 30, extraField: 1 }).expect(HttpStatus.BAD_REQUEST);
    });

    it('400 BAD_REQUEST - rejects celsius below absolute minimum', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: -274, hotFromCelsius: 0 });
      await putThresholds(updateThresholdsMock).expect(HttpStatus.BAD_REQUEST);
    });

    it('400 BAD_REQUEST - rejects celsius above configured maximum', async () => {
      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 0, hotFromCelsius: 1001 });
      await putThresholds(updateThresholdsMock).expect(HttpStatus.BAD_REQUEST);
    });

    it('404 NOT_FOUND - returns error code when singleton row is missing', async () => {
      await testService.deleteThresholdSingleton();

      const updateThresholdsMock: UpdateThresholdsMock = createThresholdsMock({ coldBelowCelsius: 10, hotFromCelsius: 30 });
      const res: request.Response = await putThresholds(updateThresholdsMock).expect(HttpStatus.NOT_FOUND);
      expect(res.body.code).toBe(TemperatureErrors.THRESHOLDS_NOT_FOUND(String(thresholdSingletonKey)).code);

      const count: number = await databaseTestService.getFrom('sensor_thresholds').count();
      expect(count).toBe(0);
    });
  });

  describe('Routing and OpenAPI', () => {
    it('404 NOT_FOUND - unknown path under API prefix', async () => {
      await request(app.getHttpServer()).get('/api/v1/temperature/unknown-route').expect(HttpStatus.NOT_FOUND);
    });

    it('404 NOT_FOUND - wrong HTTP method on /current', async () => {
      await request(app.getHttpServer()).post(`${BASE}/current`).expect(HttpStatus.NOT_FOUND);
    });

    it('200 OK - Swagger UI is mounted outside the global prefix', async () => {
      await request(app.getHttpServer()).get('/docs').expect(HttpStatus.OK);
    });
  });

  function getCurrent(): request.Test {
    return request(app.getHttpServer()).get(`${BASE}/current`);
  }

  function getHistory(): request.Test {
    return request(app.getHttpServer()).get(`${BASE}/history`);
  }

  function getThresholds(): request.Test {
    return request(app.getHttpServer()).get(`${BASE}/thresholds`);
  }

  function putThresholds(body: UpdateThresholdsMock): request.Test {
    return request(app.getHttpServer()).put(`${BASE}/thresholds`).send(body);
  }
});
