import { TemperatureReading } from '../domain/history/TemperatureReading';
import { TemperatureHistoryRepository } from '../domain/ports/TemperatureHistoryRepository';

/**
 * Returns the recorded temperature history (the last N readings retained by the
 * repository, oldest first).
 */
export class GetTemperatureHistory {
  constructor(private readonly history: TemperatureHistoryRepository) {}

  async execute(): Promise<TemperatureReading[]> {
    return this.history.findAll();
  }
}
