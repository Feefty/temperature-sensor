import { Repository } from 'typeorm';
import { startTestDatabase, stopTestDatabase, getDataSource } from '../setup/test-database';
import { TemperatureCaptureRepositoryAdapter } from '../../src/persistence/adapters/temperature-capture.repository.adapter';
import { TemperatureCaptureEntity } from '../../src/persistence/entities/temperature-capture.entity';
import { v4 as uuidv4 } from 'uuid';
import { TemperatureState } from '../../../domain/domain-contract/models/temperature-state.enum';

describe('TemperatureCaptureRepositoryAdapter', () => {
  let adapter: TemperatureCaptureRepositoryAdapter;
  let repo: Repository<TemperatureCaptureEntity>;

  beforeAll(async () => {
    const ds = await startTestDatabase();
    repo = ds.getRepository(TemperatureCaptureEntity);
    adapter = new TemperatureCaptureRepositoryAdapter(repo);
  }, 60000);

  afterAll(async () => { await stopTestDatabase(); });
  beforeEach(async () => { await repo.clear(); });

  //region save
  it('save_shouldPersistCapture_whenValidCaptureProvided', async () => {
    await adapter.save({ id: uuidv4(), value: 25.5, state: TemperatureState.WARM, capturedAt: new Date() });

    const results = await adapter.findLastN(10);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ value: 25.5, state: TemperatureState.WARM });
  });
  //endregion

  //region findLastN
  it('findLastN_shouldReturnOrderedByDateDesc_whenMultipleCapturesExist', async () => {
    for (let i = 0; i < 5; i++) {
      await adapter.save({ id: uuidv4(), value: 20 + i, state: TemperatureState.WARM, capturedAt: new Date(Date.now() + i * 1000) });
    }

    const results = await adapter.findLastN(3);

    expect(results).toHaveLength(3);
    expect(results[0].value).toBe(24);
  });

  it('findLastN_shouldRespectMaxCount_whenMoreCapturesThanLimit', async () => {
    for (let i = 0; i < 20; i++) {
      await adapter.save({ id: uuidv4(), value: i, state: TemperatureState.WARM, capturedAt: new Date(Date.now() + i * 100) });
    }

    const results = await adapter.findLastN(15);
    expect(results).toHaveLength(15);
  });

  it('findLastN_shouldReturnEmpty_whenNoCapturesExist', async () => {
    const results = await adapter.findLastN(10);
    expect(results).toEqual([]);
  });
  //endregion
});
