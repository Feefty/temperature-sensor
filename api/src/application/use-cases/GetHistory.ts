import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import type { TemperatureReading } from '../../domain/entities/TemperatureReading';
import { HISTORY_WINDOW } from '../../domain/historyWindow';

export class GetHistory {
  constructor(private readonly repository: ReadingRepository) {}

  execute(): Promise<TemperatureReading[]> {
    return this.repository.latest(HISTORY_WINDOW);
  }
}
