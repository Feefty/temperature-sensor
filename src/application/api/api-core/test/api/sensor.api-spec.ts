import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SensorController } from '../../src/controllers/sensor.controller';
import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';
import { DomainException } from '../../../../../domain/domain-contract/exceptions/domain.exception';
import { ValidationException } from '../../../../../domain/domain-contract/exceptions/validation.exception';

describe('SensorController - API Error Tests', () => {
  const DOMAIN_EXCEPTION_CODE = 'DomainException';
  const VALIDATION_EXCEPTION_CODE = 'ValidationException';
  const SENSOR_CAPTURE_ROUTE = '/api/v1/sensors/capture';
  const SENSOR_HISTORY_ROUTE = '/api/v1/sensors/history';

  let app: INestApplication;
  let commandBus: { execute: jest.Mock };
  let queryBus: { execute: jest.Mock };

  beforeAll(async () => {
    commandBus = { execute: jest.fn() };
    queryBus = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionConverter(), new ValidationExceptionConverter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  //region GET /api/v1/sensors/capture - Error Responses
  describe('GET /api/v1/sensors/capture - Error Responses', () => {
    it('getCaptureTemperature_should_returnValidExceptionResponse_when_domainExceptionIsThrown', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Sensor unavailable'));

      const res = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        statusCode: 422,
        code: DOMAIN_EXCEPTION_CODE,
        message: 'Sensor unavailable',
        path: SENSOR_CAPTURE_ROUTE,
        timestamp: expect.any(String),
      });
    });

    it('getCaptureTemperature_should_returnValidExceptionResponse_when_validationExceptionIsThrown', async () => {
      commandBus.execute.mockRejectedValue(new ValidationException('Invalid sensor configuration'));

      const res = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        code: VALIDATION_EXCEPTION_CODE,
        message: 'Invalid sensor configuration',
        path: SENSOR_CAPTURE_ROUTE,
      });
    });

    it('getCaptureTemperature_should_returnValidExceptionResponse_when_unexpectedErrorIsThrown', async () => {
      commandBus.execute.mockRejectedValue(new Error('Unexpected failure'));

      const res = await request(app.getHttpServer()).get(SENSOR_CAPTURE_ROUTE);

      expect(res.status).toBe(500);
    });
  });
  //endregion

  //region GET /api/v1/sensors/history - Error Responses
  describe('GET /api/v1/sensors/history - Error Responses', () => {
    it('getTemperatureHistory_should_returnValidExceptionResponse_when_domainExceptionIsThrown', async () => {
      queryBus.execute.mockRejectedValue(new DomainException('Repository connection lost'));

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        statusCode: 422,
        code: DOMAIN_EXCEPTION_CODE,
        message: 'Repository connection lost',
        path: SENSOR_HISTORY_ROUTE,
      });
    });

    it('getTemperatureHistory_should_returnValidExceptionResponse_when_validationExceptionIsThrown', async () => {
      queryBus.execute.mockRejectedValue(new ValidationException('Invalid query parameters'));

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        code: VALIDATION_EXCEPTION_CODE,
        message: 'Invalid query parameters',
        path: SENSOR_HISTORY_ROUTE,
      });
    });

    it('getTemperatureHistory_should_returnValidExceptionResponse_when_unexpectedErrorIsThrown', async () => {
      queryBus.execute.mockRejectedValue(new Error('Database timeout'));

      const res = await request(app.getHttpServer()).get(SENSOR_HISTORY_ROUTE);

      expect(res.status).toBe(500);
    });
  });
  //endregion
});
