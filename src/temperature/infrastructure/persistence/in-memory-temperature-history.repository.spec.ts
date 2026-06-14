import { TemperatureReading } from '../../application/models/temperature-reading';
import { MAX_TEMPERATURE_HISTORY_SIZE } from '../../application/use-cases/get-temperature-history.use-case';
import { createThresholds } from '../../domain/thresholds';
import { InMemoryTemperatureHistoryRepository } from './in-memory-temperature-history.repository';

function createReading(sequence: number): TemperatureReading {
  return {
    id: `temp_req_${sequence}`,
    temperature: sequence,
    state: 'WARM',
    thresholds: createThresholds(0, 100),
    capturedAt: new Date(`2026-06-13T10:${String(sequence).padStart(2, '0')}:00.000Z`),
  };
}

describe('InMemoryTemperatureHistoryRepository', () => {
  it('returns the latest 15 readings newest first', async (): Promise<void> => {
    const repository = new InMemoryTemperatureHistoryRepository();
    const readings: TemperatureReading[] = Array.from(
      { length: 16 },
      (_, index: number): TemperatureReading => createReading(index),
    );

    for (const reading of readings) {
      await repository.save(reading);
    }

    const result: TemperatureReading[] = await repository.findRecent(
      MAX_TEMPERATURE_HISTORY_SIZE + 1,
    );

    expect(result).toHaveLength(MAX_TEMPERATURE_HISTORY_SIZE);
    expect(result.map((reading: TemperatureReading): string => reading.id)).toEqual(
      readings
        .slice(1)
        .reverse()
        .map((reading: TemperatureReading): string => reading.id),
    );
  });
});
