import { GetTemperatureHistory } from '../../src/application/GetTemperatureHistory';
import { TemperatureReading } from '../../src/domain/history/TemperatureReading';
import { InMemoryTemperatureHistoryRepository } from '../../src/infrastructure/persistence/InMemoryTemperatureHistoryRepository';

const reading = (celsius: number): TemperatureReading => ({
  celsius,
  state: 'WARM',
  recordedAt: new Date('2026-06-09T12:00:00.000Z'),
});

describe('GetTemperatureHistory', () => {
  it('returns an empty history when nothing has been recorded', async () => {
    const useCase = new GetTemperatureHistory(new InMemoryTemperatureHistoryRepository(15));

    expect(await useCase.execute()).toEqual([]);
  });

  it('returns the recorded readings in chronological order', async () => {
    const historyRepo = new InMemoryTemperatureHistoryRepository(15);
    await historyRepo.record(reading(18));
    await historyRepo.record(reading(24));
    const useCase = new GetTemperatureHistory(historyRepo);

    expect((await useCase.execute()).map((r) => r.celsius)).toEqual([18, 24]);
  });
});
