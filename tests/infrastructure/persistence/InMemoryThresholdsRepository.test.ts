import { InMemoryThresholdsRepository } from '../../../src/infrastructure/persistence/InMemoryThresholdsRepository';
import { Thresholds } from '../../../src/domain/temperature/Thresholds';

describe('InMemoryThresholdsRepository', () => {
  it('returns the thresholds it was seeded with', async () => {
    const seed = Thresholds.default();
    const repo = new InMemoryThresholdsRepository(seed);

    expect(await repo.get()).toBe(seed);
  });

  it('returns the latest saved thresholds', async () => {
    const repo = new InMemoryThresholdsRepository(Thresholds.default());
    const updated = Thresholds.create(10, 40);

    await repo.save(updated);

    expect(await repo.get()).toBe(updated);
  });
});
