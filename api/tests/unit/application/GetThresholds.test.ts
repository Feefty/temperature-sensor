import { GetThresholds } from '../../../src/application/use-cases/GetThresholds';
import { createThresholds, DEFAULT_THRESHOLDS } from '../../../src/domain/value-objects/Thresholds';
import { FakeReadingRepository } from '../../fakes/FakeReadingRepository';

describe('GetThresholds', () => {
  it('returns the default thresholds before any change', async () => {
    expect(await new GetThresholds(new FakeReadingRepository()).execute()).toEqual(
      DEFAULT_THRESHOLDS,
    );
  });

  it('returns the latest thresholds after they are redefined', async () => {
    const repository = new FakeReadingRepository();
    await repository.setThresholds(createThresholds(10, 20));

    expect(await new GetThresholds(repository).execute()).toEqual({ coldMax: 10, hotMin: 20 });
  });
});
