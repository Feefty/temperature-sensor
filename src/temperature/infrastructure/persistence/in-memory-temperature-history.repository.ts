import { TemperatureReading } from '../../application/models/temperature-reading';
import { TemperatureHistoryRepository } from '../../application/ports/temperature-history.repository';
import { MAX_TEMPERATURE_HISTORY_SIZE } from '../../application/use-cases/get-temperature-history.use-case';

export class InvalidHistoryLimitError extends Error {
  constructor(limit: number) {
    super(`History limit must be a positive integer; received ${limit}`);
    this.name = 'InvalidHistoryLimitError';
  }
}

export class InMemoryTemperatureHistoryRepository
  implements TemperatureHistoryRepository
{
  private readonly readings: TemperatureReading[] = [];

  async save(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);
    this.readings.sort(
      (first: TemperatureReading, second: TemperatureReading): number =>
        second.capturedAt.getTime() - first.capturedAt.getTime(),
    );
    this.readings.splice(MAX_TEMPERATURE_HISTORY_SIZE);
  }

  async findRecent(limit: number): Promise<TemperatureReading[]> {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new InvalidHistoryLimitError(limit);
    }

    return this.readings.slice(0, limit);
  }
}
