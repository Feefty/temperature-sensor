import { TemperatureReading } from '../../domain/history/TemperatureReading';
import { TemperatureHistoryRepository } from '../../domain/ports/TemperatureHistoryRepository';

/**
 * In-memory {@link TemperatureHistoryRepository} backed by a bounded list.
 *
 * Each `record` appends to the end and evicts the oldest entry once `capacity`
 * is exceeded, giving a sliding window of the most recent readings. `capacity`
 * is injected (the composition root supplies the required 15) so this adapter
 * carries no magic number and can be exercised with small windows in tests.
 */
export class InMemoryTemperatureHistoryRepository implements TemperatureHistoryRepository {
  private readonly readings: TemperatureReading[] = [];

  constructor(private readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error(`history capacity must be a positive integer (received ${capacity})`);
    }
  }

  async record(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);
    if (this.readings.length > this.capacity) {
      this.readings.shift();
    }
  }

  async findAll(): Promise<TemperatureReading[]> {
    // Defensive copy: callers must not be able to mutate our internal window.
    return [...this.readings];
  }
}
