import {
  InvalidThresholdRangeError,
  createThresholds,
  Thresholds,
} from '../../domain/thresholds';
import { ThresholdsRepository } from '../ports/thresholds.repository';
import {
  EmptyThresholdUpdateError,
  updateThresholds,
} from './update-thresholds.use-case';

describe('updateThresholds', () => {
  it.each([
    {
      active: { coldThreshold: 21, hotThreshold: 34 },
      update: { hotThreshold: 32 },
      expected: { coldThreshold: 21, hotThreshold: 32 },
    },
    {
      active: { coldThreshold: 21, hotThreshold: 34 },
      update: { coldThreshold: 20 },
      expected: { coldThreshold: 20, hotThreshold: 34 },
    },
    {
      active: { coldThreshold: 21, hotThreshold: 34 },
      update: { coldThreshold: 18, hotThreshold: 30 },
      expected: { coldThreshold: 18, hotThreshold: 30 },
    },
  ] as const)(
    'merges $update with active thresholds $active',
    async ({ active, update, expected }): Promise<void> => {
      const save: jest.Mock<Promise<void>, [Thresholds]> = jest
        .fn<Promise<void>, [Thresholds]>()
        .mockResolvedValue(undefined);
      const repository: ThresholdsRepository = {
        get: jest
          .fn<Promise<Thresholds>, []>()
          .mockResolvedValue(
            createThresholds(active.coldThreshold, active.hotThreshold),
          ),
        save,
      };

      const result: Thresholds = await updateThresholds(
        { thresholdsRepository: repository },
        update,
      );

      expect(result).toEqual(expected);
      expect(save).toHaveBeenCalledWith(expected);
    },
  );

  it('rejects an empty update without reading or saving thresholds', async (): Promise<void> => {
    const repository: ThresholdsRepository = {
      get: jest.fn<Promise<Thresholds>, []>(),
      save: jest.fn<Promise<void>, [Thresholds]>(),
    };

    await expect(
      updateThresholds({ thresholdsRepository: repository }, {}),
    ).rejects.toBeInstanceOf(EmptyThresholdUpdateError);
    expect(repository.get).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects an invalid merged range without saving it', async (): Promise<void> => {
    const save: jest.Mock<Promise<void>, [Thresholds]> = jest.fn();
    const repository: ThresholdsRepository = {
      get: jest
        .fn<Promise<Thresholds>, []>()
        .mockResolvedValue(createThresholds(22, 35)),
      save,
    };

    await expect(
      updateThresholds(
        { thresholdsRepository: repository },
        { hotThreshold: 23 },
      ),
    ).rejects.toBeInstanceOf(InvalidThresholdRangeError);
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects a hot threshold below the active cold threshold', async (): Promise<void> => {
    const save: jest.Mock<Promise<void>, [Thresholds]> = jest.fn();
    const repository: ThresholdsRepository = {
      get: jest
        .fn<Promise<Thresholds>, []>()
        .mockResolvedValue(createThresholds(22, 35)),
      save,
    };

    await expect(
      updateThresholds(
        { thresholdsRepository: repository },
        { hotThreshold: 20 },
      ),
    ).rejects.toBeInstanceOf(InvalidThresholdRangeError);
    expect(save).not.toHaveBeenCalled();
  });
});
