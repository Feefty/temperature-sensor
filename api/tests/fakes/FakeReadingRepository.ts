import type { ReadingRepository } from '../../src/domain/ports/ReadingRepository';
import type { TemperatureReading } from '../../src/domain/entities/TemperatureReading';
import { DEFAULT_THRESHOLDS, type Thresholds } from '../../src/domain/value-objects/Thresholds';

// Test double without the retention cap; bounding history is the real adapter's job.
export class FakeReadingRepository implements ReadingRepository {
  private readings: TemperatureReading[] = [];
  private thresholds: Thresholds = DEFAULT_THRESHOLDS;

  append(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);
    return Promise.resolve();
  }

  latest(count: number): Promise<TemperatureReading[]> {
    return Promise.resolve([...this.readings].reverse().slice(0, count));
  }

  getThresholds(): Promise<Thresholds> {
    return Promise.resolve(this.thresholds);
  }

  setThresholds(thresholds: Thresholds): Promise<void> {
    this.thresholds = thresholds;
    return Promise.resolve();
  }
}
