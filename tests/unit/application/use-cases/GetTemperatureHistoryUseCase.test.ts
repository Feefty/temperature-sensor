import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTemperatureHistoryUseCase } from '../../../../src/application/use-cases/GetTemperatureHistoryUseCase';
import { Temperature } from '../../../../src/domain/entities/Temperature';
import { TemperatureState } from '../../../../src/domain/entities/TemperatureState';
import { ITemperatureRepository } from '../../../../src/domain/repositories/ITemperatureRepository';

describe('GetTemperatureHistoryUseCase', () => {
  const mockTempRepo: ITemperatureRepository = {
    save: vi.fn(),
    findLast: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty history when no readings', async () => {
    vi.mocked(mockTempRepo.findLast).mockResolvedValue([]);

    const useCase = new GetTemperatureHistoryUseCase(mockTempRepo);
    const result = await useCase.execute();

    expect(result.records).toHaveLength(0);
    expect(result.count).toBe(0);
    expect(mockTempRepo.findLast).toHaveBeenCalledWith(15);
  });

  it('should return last 15 readings', async () => {
    const temperatures = Array.from({ length: 15 }, (_, i) =>
      new Temperature(`id-${i}`, 20 + i, TemperatureState.WARM, new Date())
    );
    vi.mocked(mockTempRepo.findLast).mockResolvedValue(temperatures);

    const useCase = new GetTemperatureHistoryUseCase(mockTempRepo);
    const result = await useCase.execute();

    expect(result.records).toHaveLength(15);
    expect(result.count).toBe(15);
  });

  it('should map temperatures to DTOs correctly', async () => {
    const timestamp = new Date('2026-02-02T10:00:00Z');
    const temperature = new Temperature('id-1', 25.5, TemperatureState.WARM, timestamp);
    vi.mocked(mockTempRepo.findLast).mockResolvedValue([temperature]);

    const useCase = new GetTemperatureHistoryUseCase(mockTempRepo);
    const result = await useCase.execute();

    expect(result.records[0]).toEqual({
      id: 'id-1',
      value: 25.5,
      state: 'WARM',
      timestamp: '2026-02-02T10:00:00.000Z'
    });
  });
});
