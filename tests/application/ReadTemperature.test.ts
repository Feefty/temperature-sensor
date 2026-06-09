import { ReadTemperature } from '../../src/application/ReadTemperature';
import { Clock } from '../../src/domain/time/Clock';
import { Thresholds } from '../../src/domain/temperature/Thresholds';
import { InMemoryTemperatureHistoryRepository } from '../../src/infrastructure/persistence/InMemoryTemperatureHistoryRepository';
import { InMemoryThresholdsRepository } from '../../src/infrastructure/persistence/InMemoryThresholdsRepository';
import { FakeTemperatureSensor } from '../fakes/FakeTemperatureSensor';

const FIXED_NOW = new Date('2026-06-09T12:00:00.000Z');
const fixedClock: Clock = () => FIXED_NOW;

const buildUseCase = (celsius: number, thresholds = Thresholds.default()) => {
  const sensor = new FakeTemperatureSensor(celsius);
  const thresholdsRepo = new InMemoryThresholdsRepository(thresholds);
  const historyRepo = new InMemoryTemperatureHistoryRepository(15);
  const useCase = new ReadTemperature(sensor, thresholdsRepo, historyRepo, fixedClock);
  return { sensor, historyRepo, useCase };
};

describe('ReadTemperature', () => {
  it('returns the reading classified against the active thresholds', async () => {
    const { useCase } = buildUseCase(40);

    const reading = await useCase.execute();

    expect(reading).toEqual({
      celsius: 40,
      state: 'HOT',
      recordedAt: FIXED_NOW,
    });
  });

  it('records every reading in history', async () => {
    const { historyRepo, useCase } = buildUseCase(25);

    await useCase.execute();

    const history = await historyRepo.findAll();
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual({ celsius: 25, state: 'WARM', recordedAt: FIXED_NOW });
  });

  it('classifies using the thresholds currently in the repository', async () => {
    // 5°C is COLD under the defaults but WARM once the cold boundary drops to 0.
    const { useCase } = buildUseCase(5, Thresholds.create(0, 10));

    const reading = await useCase.execute();

    expect(reading.state).toBe('WARM');
  });

  it('accumulates successive readings in chronological order', async () => {
    const { sensor, historyRepo, useCase } = buildUseCase(10);

    await useCase.execute();
    sensor.setNext(45);
    await useCase.execute();

    expect((await historyRepo.findAll()).map((r) => r.celsius)).toEqual([10, 45]);
  });
});
