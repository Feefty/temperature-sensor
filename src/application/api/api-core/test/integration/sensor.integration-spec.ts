import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { SensorController } from '../../src/controllers/sensor.controller';
import { ThresholdController } from '../../src/controllers/threshold.controller';
import { CaptureTemperatureUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/capture-temperature.usecase';
import { GetTemperatureHistoryUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/get-temperature-history.usecase';
import { GetThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/get-thresholds.usecase';
import { UpdateThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/update-thresholds.usecase';
import {
  TEMPERATURE_CAPTURE_REPOSITORY,
  THRESHOLD_REPOSITORY,
} from '../../../../../shared/dinjection/tokens/injection-tokens';
import { TemperatureCaptureRepositoryAdapter } from '../../../../../infrastructure/src/persistence/adapters/temperature-capture.repository.adapter';
import { ThresholdRepositoryAdapter } from '../../../../../infrastructure/src/persistence/adapters/threshold.repository.adapter';
import { TemperatureCaptureEntity } from '../../../../../infrastructure/src/persistence/entities/temperature-capture.entity';
import { ThresholdEntity } from '../../../../../infrastructure/src/persistence/entities/threshold.entity';
import { TemperatureState } from '../../../api-contract/generated/types.gen';
import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';

describe('SensorController - Integration Tests', () => {
  const SENSOR_CAPTURE_ROUTE = '/api/v1/sensors/capture';
  const SENSOR_HISTORY_ROUTE = '/api/v1/sensors/history';
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

  let app: INestApplication;
  let container: StartedTestContainer;
  let dataSource: DataSource;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_DB: 'test_db',
        POSTGRES_USER: 'admin',
        POSTGRES_PASSWORD: 'password',
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections', 2))
      .start();

    const port = container.getMappedPort(5432);
    const host = container.getHost();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host,
          port,
          username: 'admin',
          password: 'password',
          database: 'test_db',
          entities: [TemperatureCaptureEntity, ThresholdEntity],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([TemperatureCaptureEntity, ThresholdEntity]),
      ],
      controllers: [SensorController, ThresholdController],
      providers: [
        CaptureTemperatureUseCase,
        GetTemperatureHistoryUseCase,
        GetThresholdsUseCase,
        UpdateThresholdsUseCase,
        { provide: TEMPERATURE_CAPTURE_REPOSITORY, useClass: TemperatureCaptureRepositoryAdapter },
        { provide: THRESHOLD_REPOSITORY, useClass: ThresholdRepositoryAdapter },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionConverter(), new ValidationExceptionConverter());
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    const migrationSql = fs.readFileSync(
      path.resolve(
        __dirname,
        '../../../../../infrastructure/src/resources/db/migrations/001_initial_schema.sql',
      ),
      'utf8',
    );
    const seedSql = fs.readFileSync(
      path.resolve(
        __dirname,
        '../../../../../infrastructure/src/resources/db/seeds/001_default_thresholds.sql',
      ),
      'utf8',
    );
    await dataSource.query(migrationSql);
    await dataSource.query(seedSql);
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  //region GET /api/v1/sensors/capture - Success
  describe('GET /api/v1/sensors/capture - Success', () => {
    it('captureTemperature_shouldReturn200WithValidCapture_whenThresholdExists', async () => {
      const res = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body).toMatchObject({
        id: expect.stringMatching(UUID_REGEX),
        value: expect.any(Number),
        capturedAt: expect.stringMatching(TIME_REGEX),
      });
      expect(Object.values(TemperatureState)).toContain(res.body.state);
    });
  });
  //endregion

  //region GET /api/v1/sensors/history - Success
  describe('GET /api/v1/sensors/history - Success', () => {
    it('getTemperatureHistory_shouldReturn200WithArray_whenCapturesExist', async () => {
      await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('getTemperatureHistory_shouldReturnCapturesOrderedByDateDesc_whenMultipleCapturesExist', async () => {
      await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);
      await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      const { body } = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(body.length).toBeGreaterThanOrEqual(2);
      expect(body).toEqual(
        // comparing the endpoint call result with the same hard sorted result list
        [...body].sort(
          (a: any, b: any) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
        ),
      );
    });

    it('getTemperatureHistory_shouldReturnMaximum15Captures_whenMoreThan15Exist', async () => {
      for (let i = 0; i < 16; i++) {
        await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);
      }

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(res.body.length).toBeLessThanOrEqual(15);
    });

    it('getTemperatureHistory_shouldReturnCorrectFormat_whenCapturesExist', async () => {
      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      res.body.forEach((capture: any) => {
        expect(capture).toMatchObject({
          id: expect.stringMatching(UUID_REGEX),
          value: expect.any(Number),
          capturedAt: expect.stringMatching(TIME_REGEX),
        });
        expect(Object.values(TemperatureState)).toContain(capture.state);
      });
    });
  });
  //endregion

  //region GET /api/v1/sensors/capture - Error (no threshold)
  describe('GET /api/v1/sensors/capture - No Threshold', () => {
    it('captureTemperature_shouldReturn422_whenNoThresholdInDatabase', async () => {
      await dataSource.query('DELETE FROM thresholds');

      const res = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        statusCode: 422,
        code: 'DomainException',
        message: 'No threshold configuration found',
      });
    });
  });
  //endregion
});
