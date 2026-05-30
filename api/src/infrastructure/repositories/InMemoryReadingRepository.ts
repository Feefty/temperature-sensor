import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import type { TemperatureReading } from '../../domain/entities/TemperatureReading';
import { DEFAULT_THRESHOLDS, type Thresholds } from '../../domain/value-objects/Thresholds';
import { HISTORY_WINDOW } from '../../domain/historyWindow';

// Bounded to HISTORY_WINDOW. push/shift is O(window) on a fixed 15-item list, so a
// ring buffer would be premature optimisation here; simplicity wins.
export class InMemoryReadingRepository implements ReadingRepository {
  private readonly readings: TemperatureReading[] = [];
  private thresholds: Thresholds = DEFAULT_THRESHOLDS;

  append(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);
    if (this.readings.length > HISTORY_WINDOW) {
      this.readings.shift();
    }
    return Promise.resolve();
  }

  latest(count: number): Promise<TemperatureReading[]> {
    if (count <= 0) {
      return Promise.resolve([]);
    }
    return Promise.resolve(this.readings.slice(-count).reverse());
  }

  getThresholds(): Promise<Thresholds> {
    return Promise.resolve(this.thresholds);
  }

  setThresholds(thresholds: Thresholds): Promise<void> {
    this.thresholds = thresholds;
    return Promise.resolve();
  }
}
