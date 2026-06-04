import { GetHistory } from '../../../src/application/use-cases/GetHistory';
import { createTemperature } from '../../../src/domain/value-objects/Temperature';
import { DEFAULT_THRESHOLDS } from '../../../src/domain/value-objects/Thresholds';
import type { TemperatureReading } from '../../../src/domain/entities/TemperatureReading';
import { FakeReadingRepository } from '../../fakes/FakeReadingRepository';

function reading(celsius: number, state: TemperatureReading['state']): TemperatureReading {
  return {
    temperature: createTemperature(celsius),
    state,
    capturedAt: new Date(),
    thresholds: DEFAULT_THRESHOLDS,
  };
}

describe('GetHistory', () => {
  it('returns the most recent readings, newest first', async () => {
    const repository = new FakeReadingRepository();
    await repository.append(reading(20, 'WARM'));
    await repository.append(reading(40, 'HOT'));

    const history = await new GetHistory(repository).execute();

    expect(history).toHaveLength(2);
    expect(history[0]?.state).toBe('HOT');
  });

  it('caps the history at the configured window of 15', async () => {
    const repository = new FakeReadingRepository();
    for (let i = 0; i < 20; i += 1) {
      await repository.append(reading(20, 'WARM'));
    }

    const history = await new GetHistory(repository).execute();

    expect(history).toHaveLength(15);
  });

  it('returns an empty list when there are no readings', async () => {
    expect(await new GetHistory(new FakeReadingRepository()).execute()).toEqual([]);
  });
});
