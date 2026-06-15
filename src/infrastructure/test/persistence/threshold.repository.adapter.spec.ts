import { Repository } from 'typeorm';
import { startTestDatabase, stopTestDatabase } from '../setup/setup-test-database';
import { ThresholdRepositoryAdapter } from '../../src/persistence/adapters/threshold.repository.adapter';
import { ThresholdEntity } from '../../src/persistence/entities/threshold.entity';

describe('ThresholdRepositoryAdapterTest', () => {
  let adapter: ThresholdRepositoryAdapter;
  let repo: Repository<ThresholdEntity>;

  beforeAll(async () => {
    const ds = await startTestDatabase();
    repo = ds.getRepository(ThresholdEntity);
    adapter = new ThresholdRepositoryAdapter(repo);
  }, 60000);

  afterAll(async () => {
    await stopTestDatabase();
  });

  //region getCurrent
  it('getCurrent_should_returnSeededThreshold_when_databaseIsSeeded', async () => {
    const result = await adapter.getCurrent();

    // values from the db resource seeding SQL script
    expect(result).toMatchObject({
      coldMax: 22,
      hotMin: 35,
    });
  });

  it('getCurrent_should_returnNull_when_noThresholdExists', async () => {
    await repo.clear();

    const result = await adapter.getCurrent();

    expect(result).toBeNull();
  });
  //endregion

  //region update
  it('update_should_returnUpdatedValues_when_validInput', async () => {
    const result = await adapter.update(18, 30);

    expect(result).toMatchObject({
      coldMax: 18,
      hotMin: 30,
    });
  });

  it('update_should_persistValues_when_updated', async () => {
    await adapter.update(15, 40);

    const result = await adapter.getCurrent();
    expect(result).toMatchObject({
      coldMax: 15,
      hotMin: 40,
    });
  });
  //endregion
});
