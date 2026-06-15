import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ThresholdController } from '../../src/controllers/threshold.controller';
import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';
import { DomainException } from '../../../../../domain/domain-contract/exceptions/domain.exception';
import { ValidationException } from '../../../../../domain/domain-contract/exceptions/validation.exception';

describe('ThresholdController - API Error Tests', () => {
  const DOMAIN_EXCEPTION_CODE = 'DomainException';
  const VALIDATION_EXCEPTION_CODE = 'ValidationException';
  const THRESHOLD_ROUTE = '/api/v1/thresholds';

  let app: INestApplication;
  let commandBus: { execute: jest.Mock };
  let queryBus: { execute: jest.Mock };

  beforeAll(async () => {
    commandBus = { execute: jest.fn() };
    queryBus = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ThresholdController],
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

  //region GET /api/v1/thresholds - Error Responses
  describe('GET /api/v1/thresholds - Error Responses', () => {
    it('getThresholds_should_returnValidExceptionResponse_when_domainExceptionIsThrown', async () => {
      queryBus.execute.mockRejectedValue(new DomainException('Threshold not initialized'));

      const res = await request(app.getHttpServer()).get(THRESHOLD_ROUTE);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        statusCode: 422,
        code: DOMAIN_EXCEPTION_CODE,
        message: 'Threshold not initialized',
        path: THRESHOLD_ROUTE,
        timestamp: expect.any(String),
      });
    });

    it('getThresholds_should_returnValidExceptionResponse_when_unexpectedErrorIsThrown', async () => {
      queryBus.execute.mockRejectedValue(new Error('Connection refused'));

      const res = await request(app.getHttpServer()).get(THRESHOLD_ROUTE);

      expect(res.status).toBe(500);
    });
  });
  //endregion

  //region PUT /api/v1/thresholds - Domain Error Responses
  describe('PUT /api/v1/thresholds - Domain Error Responses', () => {
    it('updateThresholds_should_returnValidExceptionResponse_when_domainExceptionIsThrown', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Concurrent modification'));

      const res = await request(app.getHttpServer())
        .put(THRESHOLD_ROUTE)
        .send({ coldMax: 22, hotMin: 35 });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        statusCode: 422,
        code: DOMAIN_EXCEPTION_CODE,
        message: 'Concurrent modification',
        path: THRESHOLD_ROUTE,
      });
    });

    it('updateThresholds_should_returnValidExceptionResponse_when_validationExceptionIsThrown', async () => {
      commandBus.execute.mockRejectedValue(
        new ValidationException('coldMax must be less than hotMin'),
      );

      const res = await request(app.getHttpServer())
        .put(THRESHOLD_ROUTE)
        .send({ coldMax: 22, hotMin: 35 });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        statusCode: 400,
        code: VALIDATION_EXCEPTION_CODE,
        message: 'coldMax must be less than hotMin',
        path: THRESHOLD_ROUTE,
      });
    });

    it('updateThresholds_should_returnValidExceptionResponse_when_unexpectedErrorIsThrown', async () => {
      commandBus.execute.mockRejectedValue(new Error('Transaction rollback'));

      const res = await request(app.getHttpServer())
        .put(THRESHOLD_ROUTE)
        .send({ coldMax: 22, hotMin: 35 });

      expect(res.status).toBe(500);
    });
  });
  //endregion

  //region PUT /api/v1/thresholds - Validation (Zod) Responses
  describe('PUT /api/v1/thresholds - Zod Deserialization', () => {
    it('updateThresholds_should_returnValidExceptionResponseBeforeReachingDomain_when_bodyInvalid', async () => {
      const res = await request(app.getHttpServer())
        .put(THRESHOLD_ROUTE)
        .send({ coldMax: 'not-a-number', hotMin: 35 });

      expect(res.status).toBe(400);
      expect(commandBus.execute).not.toHaveBeenCalled();
    });

    it('updateThresholds_should_returnValidExceptionResponseBeforeReachingDomain_when_bodyEmpty', async () => {
      const res = await request(app.getHttpServer()).put(THRESHOLD_ROUTE).send({});

      expect(res.status).toBe(400);
      expect(commandBus.execute).not.toHaveBeenCalled();
    });
  });
  //endregion
});
