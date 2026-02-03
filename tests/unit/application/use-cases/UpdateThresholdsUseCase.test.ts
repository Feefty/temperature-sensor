import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateThresholdsUseCase } from '../../../../src/application/use-cases/UpdateThresholdsUseCase';
import { ThresholdConfig } from '../../../../src/domain/entities/ThresholdConfig';
import { IThresholdConfigRepository } from '../../../../src/domain/repositories/IThresholdConfigRepository';

describe('UpdateThresholdsUseCase', () => {
  const mockThresholdRepo: IThresholdConfigRepository = {
    get: vi.fn(),
    save: vi.fn(),
    update: vi.fn()
  };

  const defaultThresholds = new ThresholdConfig('1', 35, 22, new Date(), new Date());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockThresholdRepo.get).mockResolvedValue(defaultThresholds);
    vi.mocked(mockThresholdRepo.update).mockImplementation((config) => Promise.resolve(config));
  });

  it('should update hot threshold only', async () => {
    const useCase = new UpdateThresholdsUseCase(mockThresholdRepo);
    const result = await useCase.execute({ hotThreshold: 40 });

    expect(result.hotThreshold).toBe(40);
    expect(result.coldThreshold).toBe(22);
  });

  it('should update cold threshold only', async () => {
    const useCase = new UpdateThresholdsUseCase(mockThresholdRepo);
    const result = await useCase.execute({ coldThreshold: 15 });

    expect(result.hotThreshold).toBe(35);
    expect(result.coldThreshold).toBe(15);
  });

  it('should update both thresholds', async () => {
    const useCase = new UpdateThresholdsUseCase(mockThresholdRepo);
    const result = await useCase.execute({ hotThreshold: 45, coldThreshold: 10 });

    expect(result.hotThreshold).toBe(45);
    expect(result.coldThreshold).toBe(10);
  });

  it('should throw error when config not found', async () => {
    vi.mocked(mockThresholdRepo.get).mockResolvedValue(null);

    const useCase = new UpdateThresholdsUseCase(mockThresholdRepo);

    await expect(useCase.execute({ hotThreshold: 40 })).rejects.toThrow(
      'Threshold configuration not found'
    );
  });

  it('should throw error when hotThreshold <= coldThreshold', async () => {
    const useCase = new UpdateThresholdsUseCase(mockThresholdRepo);

    await expect(useCase.execute({ hotThreshold: 20, coldThreshold: 25 })).rejects.toThrow();
  });
});
