import { UpdateThresholds } from '../../src/application/UpdateThresholds';
import { InvalidThresholdsError } from '../../src/domain/errors/InvalidThresholdsError';
import { Thresholds } from '../../src/domain/temperature/Thresholds';
import { InMemoryThresholdsRepository } from '../../src/infrastructure/persistence/InMemoryThresholdsRepository';

describe('UpdateThresholds', () => {
  it('persists and returns the new thresholds', async () => {
    const repo = new InMemoryThresholdsRepository(Thresholds.default());
    const useCase = new UpdateThresholds(repo);

    const result = await useCase.execute({ cold: 10, hot: 40 });

    expect(result.cold).toBe(10);
    expect(result.hot).toBe(40);
    expect(await repo.get()).toBe(result);
  });

  it('rejects an invalid combination and leaves the stored thresholds untouched', async () => {
    const seed = Thresholds.default();
    const repo = new InMemoryThresholdsRepository(seed);
    const useCase = new UpdateThresholds(repo);

    await expect(useCase.execute({ cold: 40, hot: 10 })).rejects.toThrow(InvalidThresholdsError);
    expect(await repo.get()).toBe(seed);
  });
});
