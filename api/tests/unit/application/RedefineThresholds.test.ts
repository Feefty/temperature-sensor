import { RedefineThresholds } from '../../../src/application/use-cases/RedefineThresholds';
import { ThresholdsInvariantError } from '../../../src/domain/errors/DomainError';
import { FakeReadingRepository } from '../../fakes/FakeReadingRepository';

describe('RedefineThresholds', () => {
  it('persists and returns valid thresholds', async () => {
    const repository = new FakeReadingRepository();

    const result = await new RedefineThresholds(repository).execute({ coldMax: 10, hotMin: 20 });

    expect(result).toEqual({ coldMax: 10, hotMin: 20 });
    expect(await repository.getThresholds()).toEqual({ coldMax: 10, hotMin: 20 });
  });

  it('rejects cold >= hot and leaves the existing thresholds untouched', async () => {
    const repository = new FakeReadingRepository();

    await expect(new RedefineThresholds(repository).execute({ coldMax: 30, hotMin: 30 })).rejects.toThrow(
      ThresholdsInvariantError,
    );
    expect(await repository.getThresholds()).toEqual({ coldMax: 22, hotMin: 35 });
  });
});
