import { TemperatureReading } from '../../application/models/temperature-reading';
import { TemperatureHistoryRepository } from '../../application/ports/temperature-history.repository';

export class InvalidHistoryLimitError extends Error {
  constructor(limit: number) {
    super(`History limit must be a positive integer; received ${limit}`);
    this.name = 'InvalidHistoryLimitError';
  }
}

export class InMemoryTemperatureHistoryRepository
  implements TemperatureHistoryRepository
{
  private readings: TemperatureReading[] = [];

  async save(reading: TemperatureReading): Promise<void> {
    this.readings = [...this.readings, reading];
  }

  async findRecent(limit: number): Promise<TemperatureReading[]> {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new InvalidHistoryLimitError(limit);
    }

    return [...this.readings]
      .sort(
        (first: TemperatureReading, second: TemperatureReading): number =>
          second.capturedAt.getTime() - first.capturedAt.getTime(),
      )
      .slice(0, limit);
  }
}
