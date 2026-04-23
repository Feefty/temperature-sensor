import { Test, TestingModule } from '@nestjs/testing';
import { ValidationException } from '@shared/common/error-handling/domain/exceptions/validation.exception';
import { Logger as AppLogger } from '@shared/common/logger/logger.service';
import { SensorThresholds } from '../../../domain/sensor-thresholds';
import { THRESHOLDS_REPOSITORY, ThresholdsRepositoryPort } from '../../ports/thresholds.repository.port';
import { UpdateThresholdsUseCase } from '../update-thresholds.use-case';

function createLoggerMock(): AppLogger {
  return {
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    silly: jest.fn(),
    alert: jest.fn(),
  } as unknown as AppLogger;
}

describe('UpdateThresholdsUseCase', (): void => {
  let module: TestingModule;
  let useCase: UpdateThresholdsUseCase;
  let thresholdsRepository: ThresholdsRepositoryPort;
  let logger: AppLogger;

  beforeAll(async (): Promise<void> => {
    module = await Test.createTestingModule({
      providers: [
        UpdateThresholdsUseCase,
        { provide: AppLogger, useValue: createLoggerMock() },
        {
          provide: THRESHOLDS_REPOSITORY,
          useValue: {
            get: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateThresholdsUseCase);
    thresholdsRepository = module.get(THRESHOLDS_REPOSITORY);
    logger = module.get(AppLogger);
  });

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  afterAll(async (): Promise<void> => {
    await module.close();
  });

  it('persists valid thresholds', async (): Promise<void> => {
    const sensorThresholds: SensorThresholds = new SensorThresholds();
    sensorThresholds.coldBelowCelsius = 20;
    sensorThresholds.hotFromCelsius = 32;
    jest.spyOn(thresholdsRepository, 'update').mockResolvedValue(undefined);
    jest.spyOn(thresholdsRepository, 'get').mockResolvedValue(sensorThresholds);

    const result: SensorThresholds = await useCase.execute(sensorThresholds);

    expect(result).toEqual(sensorThresholds);
    expect(thresholdsRepository.update).toHaveBeenCalledWith(sensorThresholds);
  });

  it('rejects when cold is not strictly below hot', async (): Promise<void> => {
    await expect(useCase.execute({ coldBelowCelsius: 35, hotFromCelsius: 35 })).rejects.toBeInstanceOf(
      ValidationException
    );
    expect(thresholdsRepository.update).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });
});
