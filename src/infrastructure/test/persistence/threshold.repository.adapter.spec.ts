import { Repository } from 'typeorm';
import { startTestDatabase, stopTestDatabase, getDataSource } from '../setup/test-database';
import { ThresholdRepositoryAdapter } from '../../src/persistence/adapters/threshold.repository.adapter';
import { ThresholdEntity } from '../../src/persistence/entities/threshold.entity';

describe('ThresholdRepositoryAdapter (integration)', () => {
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

  it('should_get_current_thresholds_from_seed', async () => {
    const result = await adapter.getCurrent();

    expect(result!.coldMax).toBe(22);
    expect(result!.hotMin).toBe(35);
  });

  it('should_update_thresholds', async () => {
    const result = await adapter.update(18, 30);

    expect(result!.coldMax).toBe(18);
    expect(result!.hotMin).toBe(30);
  });

  it('should_persist_updated_thresholds', async () => {
    await adapter.update(15, 40);
    const result = await adapter.getCurrent();

    expect(result!.coldMax).toBe(15);
    expect(result!.hotMin).toBe(40);
  });
});
