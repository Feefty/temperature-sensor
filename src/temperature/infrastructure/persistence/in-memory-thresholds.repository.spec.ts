import {
  createThresholds,
  DEFAULT_THRESHOLDS,
} from '../../domain/thresholds';
import { InMemoryThresholdsRepository } from './in-memory-thresholds.repository';

describe('InMemoryThresholdsRepository', () => {
  it('starts with the default thresholds', async (): Promise<void> => {
    const repository = new InMemoryThresholdsRepository();

    await expect(repository.get()).resolves.toEqual(DEFAULT_THRESHOLDS);
  });

  it('stores updated thresholds', async (): Promise<void> => {
    const repository = new InMemoryThresholdsRepository();
    const updatedThresholds = createThresholds(20, 32);

    await repository.save(updatedThresholds);

    await expect(repository.get()).resolves.toEqual(updatedThresholds);
  });
});
