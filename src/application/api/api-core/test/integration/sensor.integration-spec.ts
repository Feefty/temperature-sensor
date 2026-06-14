import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CqrsModule } from '@nestjs/cqrs';
import { SensorController } from '../../src/controllers/sensor.controller';
import { ThresholdController } from '../../src/controllers/threshold.controller';
import { CaptureTemperatureUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/capture-temperature.usecase';
import { GetTemperatureHistoryUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/get-temperature-history.usecase';
import { GetThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/get-thresholds.usecase';
import { UpdateThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/update-thresholds.usecase';
import { TEMPERATURE_CAPTURE_REPOSITORY, THRESHOLD_REPOSITORY } from '../../../../../shared/dinjection/tokens/injection-tokens';
import { TemperatureCaptureRepositoryStub } from '../../../../../test-component/stubs/temperature-capture.repository.stub';
import { ThresholdRepositoryStub } from '../../../../../test-component/stubs/threshold.repository.stub';
import { TemperatureState } from '../../../api-contract/generated/types.gen';
import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';

describe('SensorController - Integration Tests', () => {

  let SENSOR_ROUTE : string = '/api/v1/sensors/capture';
  let SENSOR_HISTORY : string = '/api/v1/sensors/history';

  let UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  let TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

  let app: INestApplication;
  let captureRepo: TemperatureCaptureRepositoryStub;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [SensorController, ThresholdController],
      providers: [
        CaptureTemperatureUseCase,
        GetTemperatureHistoryUseCase,
        GetThresholdsUseCase,
        UpdateThresholdsUseCase,
        { provide: TEMPERATURE_CAPTURE_REPOSITORY, useClass: TemperatureCaptureRepositoryStub },
        { provide: THRESHOLD_REPOSITORY, useClass: ThresholdRepositoryStub },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionConverter(), new ValidationExceptionConverter());
    await app.init();
    captureRepo = moduleFixture.get(TEMPERATURE_CAPTURE_REPOSITORY);
  });

  afterAll(async () => { await app.close(); });

  describe('GET /api/v1/sensors/capture', () => {
    it('captureTemperature_shouldReturn200WithValidCaptureShape', async () => {
      const res = await request(app.getHttpServer()).get(SENSOR_ROUTE);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.stringMatching(UUID_REGEX),
        value: expect.any(Number),
        capturedAt: expect.stringMatching(TIME_REGEX),
      });
      expect(Object.values(TemperatureState)).toContain(res.body.state);
    });

    it('captureTemperature_shouldPersistCaptureInRepository', async () => {
      const before = captureRepo.getAll().length;
      await request(app.getHttpServer()).get(SENSOR_ROUTE);
      expect(captureRepo.getAll().length).toBe(before + 1);
    });

    it('captureTemperature_shouldAlwaysReturnValidState', async () => {
      const responses = [];
      for (let i = 0; i < 20; i++) {
        const res = await request(app.getHttpServer()).get(SENSOR_ROUTE);
        responses.push(res.body);
      }
    responses.forEach((r) => expect(Object.values(TemperatureState)).toContain(r.state));
    });
  });

  describe('GET /api/v1/sensors/history', () => {
    it('getTemperatureHistory_shouldReturn200WithArray', async () => {
      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('getTemperatureHistory_shouldReturnCapturesOrderedByDateDesc', async () => {
      await request(app.getHttpServer()).get(SENSOR_ROUTE);
      await request(app.getHttpServer()).get(SENSOR_ROUTE);

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY);

      if (res.body.length >= 2) {
        const dates = res.body.map((c: any) => new Date(c.capturedAt).getTime());
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }
    });

    it('getTemperatureHistory_shouldReturnMaximum15Captures', async () => {
      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY);
      expect(res.body.length).toBeLessThanOrEqual(15);
    });

    it('getTemperatureHistory_shouldReturnItemsWithCorrectShape', async () => {
      await request(app.getHttpServer()).get(SENSOR_ROUTE);
      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY);

      res.body.forEach((capture: any) => {
        expect(capture).toMatchObject({
          id: expect.any(String),
          value: expect.any(Number),
          capturedAt: expect.any(String),
        });
        expect(Object.values(TemperatureState)).toContain(capture.state);
      });
    });
  });
});
