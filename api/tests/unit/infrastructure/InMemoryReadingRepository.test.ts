import { InMemoryReadingRepository } from '../../../src/infrastructure/repositories/InMemoryReadingRepository';
import { createTemperature } from '../../../src/domain/value-objects/Temperature';
import { createThresholds, DEFAULT_THRESHOLDS } from '../../../src/domain/value-objects/Thresholds';
import type { TemperatureReading } from '../../../src/domain/entities/TemperatureReading';

function reading(celsius: number): TemperatureReading {
  return {
    temperature: createTemperature(celsius),
    state: 'WARM',
    capturedAt: new Date(),
    thresholds: DEFAULT_THRESHOLDS,
  };
}

describe('InMemoryReadingRepository', () => {
  it('returns appended readings newest first', async () => {
    const repository = new InMemoryReadingRepository();
    await repository.append(reading(1));
    await repository.append(reading(2));

    const latest = await repository.latest(15);

    expect(latest.map((r) => r.temperature)).toEqual([2, 1]);
  });

  it('keeps only the last 15 readings as a rolling window', async () => {
    const repository = new InMemoryReadingRepository();
    for (let celsius = 1; celsius <= 20; celsius += 1) {
      await repository.append(reading(celsius));
    }

    const latest = await repository.latest(15);

    expect(latest).toHaveLength(15);
    expect(latest[0]?.temperature).toBe(20); // newest
    expect(latest[14]?.temperature).toBe(6); // oldest still retained
  });

  it('returns at most the requested count', async () => {
    const repository = new InMemoryReadingRepository();
    await repository.append(reading(1));
    await repository.append(reading(2));
    await repository.append(reading(3));

    expect(await repository.latest(2)).toHaveLength(2);
  });

  it('returns an empty list for a non-positive count', async () => {
    const repository = new InMemoryReadingRepository();
    await repository.append(reading(1));

    expect(await repository.latest(0)).toEqual([]);
  });

  it('returns an empty history before any reading', async () => {
    expect(await new InMemoryReadingRepository().latest(15)).toEqual([]);
  });

  it('starts with the default thresholds and round-trips updates', async () => {
    const repository = new InMemoryReadingRepository();
    expect(await repository.getThresholds()).toEqual(DEFAULT_THRESHOLDS);

    await repository.setThresholds(createThresholds(5, 10));

    expect(await repository.getThresholds()).toEqual({ coldMax: 5, hotMin: 10 });
  });
});
