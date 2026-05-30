import type { TemperatureReading } from '../entities/TemperatureReading';
import type { Thresholds } from '../value-objects/Thresholds';

export interface ReadingRepository {
  append(reading: TemperatureReading): Promise<void>;
  // Most recent readings, newest first, capped at `count`.
  latest(count: number): Promise<TemperatureReading[]>;
  getThresholds(): Promise<Thresholds>;
  setThresholds(thresholds: Thresholds): Promise<void>;
}
