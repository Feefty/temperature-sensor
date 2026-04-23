import { Test, TestingModule } from '@nestjs/testing';
import { TemperatureState } from '../../../domain/temperature-state.enum';
import { TemperatureHistory } from '../../../domain/temperature-history.domain';
import {
  TEMPERATURE_HISTORY_REPOSITORY,
  TemperatureHistoryRepositoryPort,
} from '../../ports/temperature-history.repository.port';
import { TEMPERATURE_SENSOR, TemperatureSensorPort } from '../../ports/temperature-sensor.port';
import { THRESHOLDS_REPOSITORY, ThresholdsRepositoryPort } from '../../ports/thresholds.repository.port';
import { GetCurrentTemperatureUseCase } from '../get-current-temperature.use-case';
import { CurrentTemperatureResult } from '@modules/temperature/domain/current-temperature-result';

describe('GetCurrentTemperatureUseCase', (): void => {
  let module: TestingModule;
  let useCase: GetCurrentTemperatureUseCase;
  let sensor: TemperatureSensorPort;
  let thresholdsRepository: ThresholdsRepositoryPort;
  let temperatureHistoryRepository: TemperatureHistoryRepositoryPort;

  beforeAll(async (): Promise<void> => {
    module = await Test.createTestingModule({
      providers: [
        GetCurrentTemperatureUseCase,
        {
          provide: TEMPERATURE_SENSOR,
          useValue: {
            readCelsius: jest.fn(),
          },
        },
        {
          provide: THRESHOLDS_REPOSITORY,
          useValue: {
            get: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TEMPERATURE_HISTORY_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findLast: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(GetCurrentTemperatureUseCase);
    sensor = module.get(TEMPERATURE_SENSOR);
    thresholdsRepository = module.get(THRESHOLDS_REPOSITORY);
    temperatureHistoryRepository = module.get(TEMPERATURE_HISTORY_REPOSITORY);
  });

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  afterAll(async (): Promise<void> => {
    await module.close();
  });

  it('persists a temperature history and returns classification', async (): Promise<void> => {
    jest.spyOn(sensor, 'readCelsius').mockResolvedValue(24);
    jest.spyOn(thresholdsRepository, 'get').mockResolvedValue({ coldBelowCelsius: 22, hotFromCelsius: 35 });
    const temperatureHistories: TemperatureHistory[] = [];
    jest
      .spyOn(temperatureHistoryRepository, 'save')
      .mockImplementation(async (temperatureHistory: TemperatureHistory): Promise<void> => {
        temperatureHistories.push(temperatureHistory);
      });

    const result: CurrentTemperatureResult = await useCase.execute();

    expect(result.celsius).toBe(24);
    expect(result.state).toBe(TemperatureState.WARM);
    expect(temperatureHistories).toHaveLength(1);
    expect(temperatureHistories[0]?.state).toBe(TemperatureState.WARM);
    expect(temperatureHistories[0]?.snapshotColdBelow).toBe(22);
    expect(temperatureHistories[0]?.snapshotHotFrom).toBe(35);
  });
});
