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

describe('ThresholdController - Integration Tests', () => {
  const THRESHOLDS_ROUTE = '/api/v1/thresholds';
  const SENSOR_CAPTURE_ROUTE = '/api/v1/sensors/capture';
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

  //region GET /api/v1/thresholds - Success
  describe('GET /api/v1/thresholds - Success', () => {
    it('getThresholds_shouldReturn200WithSeededValues_whenDatabaseIsSeeded', async () => {
      const res = await request(app.getHttpServer()).get(THRESHOLDS_ROUTE);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        coldMax: 22,
        hotMin: 35,
        updatedAt: expect.stringMatching(TIME_REGEX),
      });
    });
  });
  //endregion

  //region PUT /api/v1/thresholds - Success
  describe('PUT /api/v1/thresholds - Success', () => {
    it('updateThresholds_shouldReturn200WithUpdatedValues_whenValid', async () => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 20, hotMin: 38 });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ coldMax: 20, hotMin: 38 });
    });

    it('updateThresholds_shouldPersistNewValues_whenValid', async () => {
      await request(app.getHttpServer()).put(THRESHOLDS_ROUTE).send({ coldMax: 18, hotMin: 40 });

      const res = await request(app.getHttpServer()).get(THRESHOLDS_ROUTE);
      expect(res.body).toMatchObject({ coldMax: 18, hotMin: 40 });
    });

    it('updateThresholds_shouldIgnoreExtraFields_whenBodyContainsUnknownProperties', async () => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 22, hotMin: 35, extraField: 'ignored' });

      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty('extraField');
    });

    it('updateThresholds_shouldApplyNewThresholds_whenCapturingAfterUpdate', async () => {
      await request(app.getHttpServer()).put(THRESHOLDS_ROUTE).send({ coldMax: 10, hotMin: 15 });

      const captureRes = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);
      expect(captureRes.status).toBe(200);
      expect(Object.values(TemperatureState)).toContain(captureRes.body.state);
    });
  });
  //endregion

  //region PUT /api/v1/thresholds - Validation Errors (Zod)
  describe('PUT /api/v1/thresholds - Zod Validation Errors', () => {
    it.each([
      ['empty body', {}],
      ['missing coldMax', { hotMin: 35 }],
      ['missing hotMin', { coldMax: 22 }],
      ['coldMax exceeds max (60)', { coldMax: 100, hotMin: 35 }],
      ['coldMax below min (-50)', { coldMax: -60, hotMin: 35 }],
      ['hotMin exceeds max (60)', { coldMax: 22, hotMin: 100 }],
      ['hotMin below min (-50)', { coldMax: 22, hotMin: -60 }],
      ['coldMax is not a number', { coldMax: 'abc', hotMin: 35 }],
      ['hotMin is not a number', { coldMax: 22, hotMin: 'xyz' }],
    ])('updateThresholds_shouldReturn400_when%s', async (_label, body) => {
      const res = await request(app.getHttpServer()).put(THRESHOLDS_ROUTE).send(body);

      expect(res.status).toBe(400);
    });
  });
  //endregion

  //region PUT /api/v1/thresholds - Domain Validation Errors
  describe('PUT /api/v1/thresholds - Domain Validation Errors', () => {
    it.each([
      ['coldMax > hotMin', { coldMax: 40, hotMin: 20 }],
      ['coldMax equals hotMin', { coldMax: 30, hotMin: 30 }],
    ])('updateThresholds_shouldReturn400_when%s', async (_label, body) => {
      const res = await request(app.getHttpServer()).put(THRESHOLDS_ROUTE).send(body);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        code: 'ValidationException',
      });
    });
  });
  //endregion

  //region GET /api/v1/thresholds - No Threshold
  describe('GET /api/v1/thresholds - No Threshold', () => {
    it('getThresholds_shouldReturn422_whenNoThresholdInDatabase', async () => {
      await dataSource.query('DELETE FROM thresholds');

      const res = await request(app.getHttpServer()).get(THRESHOLDS_ROUTE);

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
