import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCurrentTemperatureUseCase } from '../../../../src/application/use-cases/GetCurrentTemperatureUseCase';
import { TemperatureState } from '../../../../src/domain/entities/TemperatureState';
import { ThresholdConfig } from '../../../../src/domain/entities/ThresholdConfig';
import { ITemperatureSensor } from '../../../../src/application/interfaces/ITemperatureSensor';
import { ITemperatureRepository } from '../../../../src/domain/repositories/ITemperatureRepository';
import { IThresholdConfigRepository } from '../../../../src/domain/repositories/IThresholdConfigRepository';

describe('GetCurrentTemperatureUseCase', () => {
  const mockSensor: ITemperatureSensor = {
    read: vi.fn()
  };

  const mockTempRepo: ITemperatureRepository = {
    save: vi.fn(),
    findLast: vi.fn()
  };

  const mockThresholdRepo: IThresholdConfigRepository = {
    get: vi.fn(),
    save: vi.fn(),
    update: vi.fn()
  };

  const defaultThresholds = new ThresholdConfig('1', 35, 22, new Date(), new Date());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockThresholdRepo.get).mockResolvedValue(defaultThresholds);
    vi.mocked(mockTempRepo.save).mockImplementation((t) => Promise.resolve(t));
  });

  it('should return HOT state when temperature >= 35', async () => {
    vi.mocked(mockSensor.read).mockResolvedValue(38);

    const useCase = new GetCurrentTemperatureUseCase(
      mockSensor,
      mockTempRepo,
      mockThresholdRepo
    );
    const result = await useCase.execute();

    expect(result.value).toBe(38);
    expect(result.state).toBe(TemperatureState.HOT);
    expect(mockTempRepo.save).toHaveBeenCalledOnce();
  });

  it('should return COLD state when temperature < 22', async () => {
    vi.mocked(mockSensor.read).mockResolvedValue(15);

    const useCase = new GetCurrentTemperatureUseCase(
      mockSensor,
      mockTempRepo,
      mockThresholdRepo
    );
    const result = await useCase.execute();

    expect(result.value).toBe(15);
    expect(result.state).toBe(TemperatureState.COLD);
  });

  it('should return WARM state when 22 <= temperature < 35', async () => {
    vi.mocked(mockSensor.read).mockResolvedValue(28);

    const useCase = new GetCurrentTemperatureUseCase(
      mockSensor,
      mockTempRepo,
      mockThresholdRepo
    );
    const result = await useCase.execute();

    expect(result.value).toBe(28);
    expect(result.state).toBe(TemperatureState.WARM);
  });

  it('should throw error when threshold config not found', async () => {
    vi.mocked(mockThresholdRepo.get).mockResolvedValue(null);
    vi.mocked(mockSensor.read).mockResolvedValue(25);

    const useCase = new GetCurrentTemperatureUseCase(
      mockSensor,
      mockTempRepo,
      mockThresholdRepo
    );

    await expect(useCase.execute()).rejects.toThrow('Threshold configuration not found');
  });
});
