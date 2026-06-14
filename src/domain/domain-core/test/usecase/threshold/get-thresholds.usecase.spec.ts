import { GetThresholdsUseCase } from '../../../src/usecase/threshold/get-thresholds.usecase';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { DomainException } from '../../../../domain-contract/exceptions/domain.exception';

describe('GetThresholdsUseCase', () => {
  let usecase: GetThresholdsUseCase;
  let thresholdRepository: jest.Mocked<ThresholdRepositoryPort>;

  beforeEach(() => {
    thresholdRepository = { getCurrent: jest.fn(), update: jest.fn() };
    usecase = new GetThresholdsUseCase(thresholdRepository);
  });

  //region Success scenarios
  it('execute_shouldReturnThreshold_whenThresholdExists', async () => {
    const threshold = { id: 'thr-1', coldMax: 22, hotMin: 35, updatedAt: new Date() };
    thresholdRepository.getCurrent.mockResolvedValue(threshold);

    const result = await usecase.execute();

    expect(result).toMatchObject({ coldMax: 22, hotMin: 35 });
  });
  //endregion

  //region Error scenarios
  it('execute_shouldThrowDomainException_whenNoThresholdFound', async () => {
    thresholdRepository.getCurrent.mockResolvedValue(null);

    await expect(usecase.execute()).rejects.toThrow(DomainException);
    await expect(usecase.execute()).rejects.toThrow('No threshold configuration found');
  });
  //endregion
});
