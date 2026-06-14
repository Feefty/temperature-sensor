import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CqrsModule } from '@nestjs/cqrs';
import { SensorController } from '../../src/controllers/sensor.controller';
import { ThresholdController } from '../../src/controllers/threshold.controller';
import { TemperatureState } from '../../../api-contract/generated/types.gen';
import { CaptureTemperatureUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/capture-temperature.usecase';
import { GetTemperatureHistoryUseCase } from '../../../../../domain/domain-core/src/usecase/sensor/get-temperature-history.usecase';
import { GetThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/get-thresholds.usecase';
import { UpdateThresholdsUseCase } from '../../../../../domain/domain-core/src/usecase/threshold/update-thresholds.usecase';
import { TEMPERATURE_CAPTURE_REPOSITORY, THRESHOLD_REPOSITORY } from '../../../../../shared/dinjection/tokens/injection-tokens';
import { TemperatureCaptureRepositoryStub } from '../../../../../test-component/stubs/temperature-capture.repository.stub';
import { ThresholdRepositoryStub } from '../../../../../test-component/stubs/threshold.repository.stub';
import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';

describe('ThresholdController - Integration Tests', () => {

  let THRESHOLDS_ROUTE : string = '/api/v1/thresholds';
  let SENSOR_ROUTE: string = '/api/v1/sensors/capture';

  let TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

  let app: INestApplication;

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
  });

  afterAll(async () => { await app.close(); });

  describe('GET /api/v1/thresholds', () => {
    it('getThresholds_shouldReturn200WithCorrectShape', async () => {
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

  describe('PUT /api/v1/thresholds - Happy Path', () => {
    it('updateThresholds_shouldReturn200WithUpdatedValues', async () => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 20, hotMin: 38 });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ coldMax: 20, hotMin: 38 });
    });

    it('updateThresholds_shouldPersistNewValues', async () => {
      await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 18, hotMin: 40 });

      const res = await request(app.getHttpServer()).get(THRESHOLDS_ROUTE);
      expect(res.body).toMatchObject({ coldMax: 18, hotMin: 40 });
    });

    it('updateThresholds_shouldIgnoreExtraFields', async () => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 22, hotMin: 35, extraField: 'ignored' });

      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty('extraField');
    });

    it('updateThresholds_shouldApplyNewThresholdsToSubsequentCaptures', async () => {
      await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send({ coldMax: 10, hotMin: 15 });

      const captureRes = await request(app.getHttpServer()).get(SENSOR_ROUTE);
      expect(captureRes.status).toBe(200);
      expect(Object.values(TemperatureState)).toContain(captureRes.body.state);
    });
  });

  describe('PUT /api/v1/thresholds - Validation Errors', () => {
    it.each([
      ['empty body', {}, 'coldMax: Invalid input: expected number, received undefined'],
      ['missing coldMax', { hotMin: 35 }, 'coldMax: Invalid input: expected number, received undefined'],
      ['missing hotMin', { coldMax: 22 }, 'hotMin: Invalid input: expected number, received undefined'],
    ])('updateThresholds_shouldReturn400_when%s', async (_label, body, expectedMessage) => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(expectedMessage);
    });

    it.each([
      ['coldMax exceeds max (60)', { coldMax: 100, hotMin: 35 }],
      ['coldMax below min (-50)', { coldMax: -60, hotMin: 35 }],
      ['hotMin exceeds max (60)', { coldMax: 22, hotMin: 100 }],
      ['hotMin below min (-50)', { coldMax: 22, hotMin: -60 }],
      ['coldMax is not a number', { coldMax: 'abc', hotMin: 35 }],
      ['hotMin is not a number', { coldMax: 22, hotMin: 'xyz' }],
    ])('updateThresholds_shouldReturn400_when%s', async (_label, body) => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLDS_ROUTE)
        .send(body);

      expect(res.status).toBe(400);
    });
  });
});
