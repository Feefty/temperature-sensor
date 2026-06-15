import { Repository } from 'typeorm';
import { startTestDatabase, stopTestDatabase } from '../setup/setup-test-database';
import { TemperatureCaptureRepositoryAdapter } from '../../src/persistence/adapters/temperature-capture.repository.adapter';
import { TemperatureCaptureEntity } from '../../src/persistence/entities/temperature-capture.entity';
import { v4 as uuidv4 } from 'uuid';
import { TemperatureState } from '../../../domain/domain-contract/models/temperature-state.enum';

describe('TemperatureCaptureRepositoryAdapterTest', () => {
  let adapter: TemperatureCaptureRepositoryAdapter;
  let repo: Repository<TemperatureCaptureEntity>;

  beforeAll(async () => {
    const ds = await startTestDatabase();
    repo = ds.getRepository(TemperatureCaptureEntity);
    adapter = new TemperatureCaptureRepositoryAdapter(repo);
  }, 60000);

  afterAll(async () => {
    await stopTestDatabase();
  });
  beforeEach(async () => {
    await repo.clear();
  });

  //region save
  it('save_should_persistCapture_when_validCaptureProvided', async () => {
    await adapter.save({
      id: uuidv4(),
      value: 25.5,
      state: TemperatureState.WARM,
      capturedAt: new Date(),
    });

    const results = await adapter.findLastN(10);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ value: 25.5, state: TemperatureState.WARM });
  });
  //endregion

  //region findLastN
  it('findLastN_should_returnOrderedByDateDesc_when_multipleCapturesExist', async () => {
    for (let i = 0; i < 5; i++) {
      await adapter.save({
        id: uuidv4(),
        value: 20 + i,
        state: TemperatureState.WARM,
        capturedAt: new Date(Date.now() + i * 1000),
      });
    }

    const results = await adapter.findLastN(3);

    expect(results).toHaveLength(3);
    expect(results[0].value).toBe(24);
    expect(results[1].value).toBe(23);
    expect(results[2].value).toBe(22);
  });

  it('findLastN_should_respectMaxCount_when_moreCapturesThanLimit', async () => {
    for (let i = 0; i < 20; i++) {
      await adapter.save({
        id: uuidv4(),
        value: i,
        state: TemperatureState.WARM,
        capturedAt: new Date(Date.now() + i * 100),
      });
    }

    const results = await adapter.findLastN(15);
    expect(results).toHaveLength(15);
  });

  it('findLastN_should_returnEmpty_when_noCapturesExist', async () => {
    const results = await adapter.findLastN(10);
    expect(results).toEqual([]);
  });
  //endregion
});
