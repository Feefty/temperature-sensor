import { InMemoryTemperatureHistoryRepository } from '../../../src/infrastructure/persistence/InMemoryTemperatureHistoryRepository';
import { TemperatureReading } from '../../../src/domain/history/TemperatureReading';

/**
 * Builds a reading whose `celsius` doubles as an identity tag, so tests can
 * assert exactly which readings were retained and in what order.
 */
const reading = (tag: number): TemperatureReading => ({
  celsius: tag,
  state: 'WARM',
  recordedAt: new Date(2026, 0, 1, 0, 0, tag),
});

describe('InMemoryTemperatureHistoryRepository', () => {
  it('starts empty', async () => {
    const repo = new InMemoryTemperatureHistoryRepository(15);

    expect(await repo.findAll()).toEqual([]);
  });

  it('returns readings in chronological order while under capacity', async () => {
    const repo = new InMemoryTemperatureHistoryRepository(15);

    await repo.record(reading(1));
    await repo.record(reading(2));
    await repo.record(reading(3));

    expect((await repo.findAll()).map((r) => r.celsius)).toEqual([1, 2, 3]);
  });

  it('keeps only the last 15 readings: drops the oldest, most recent last', async () => {
    const repo = new InMemoryTemperatureHistoryRepository(15);

    // Record 20 requests tagged 1..20 — five more than the window.
    for (let tag = 1; tag <= 20; tag++) {
      await repo.record(reading(tag));
    }

    const all = await repo.findAll();

    expect(all).toHaveLength(15);
    // The five oldest (1..5) were evicted; 6 is now the oldest, 20 the newest.
    expect(all[0]!.celsius).toBe(6);
    expect(all.at(-1)!.celsius).toBe(20);
    expect(all.map((r) => r.celsius)).toEqual([
      6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
  });

  it('does not expose its internal window to mutation', async () => {
    const repo = new InMemoryTemperatureHistoryRepository(15);
    await repo.record(reading(1));

    (await repo.findAll()).push(reading(99));

    expect((await repo.findAll()).map((r) => r.celsius)).toEqual([1]);
  });

  it('rejects a non-positive capacity', () => {
    expect(() => new InMemoryTemperatureHistoryRepository(0)).toThrow();
    expect(() => new InMemoryTemperatureHistoryRepository(-1)).toThrow();
  });
});
