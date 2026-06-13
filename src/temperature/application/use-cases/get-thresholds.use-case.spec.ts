import { createThresholds, Thresholds } from '../../domain/thresholds';
import { ThresholdsRepository } from '../ports/thresholds.repository';
import { getThresholds } from './get-thresholds.use-case';

describe('getThresholds', () => {
  it('returns the active thresholds', async (): Promise<void> => {
    const thresholds: Thresholds = createThresholds(22, 35);
    const repository: ThresholdsRepository = {
      get: jest.fn<Promise<Thresholds>, []>().mockResolvedValue(thresholds),
      save: jest.fn<Promise<void>, [Thresholds]>().mockResolvedValue(undefined),
    };

    await expect(
      getThresholds({ thresholdsRepository: repository }),
    ).resolves.toBe(thresholds);
  });
});
