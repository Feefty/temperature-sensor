import { TemperatureReading } from '../history/TemperatureReading';

/**
 * Driven port persisting the rolling history of temperature requests.
 *
 * `findAll` returns the retained readings in chronological order (oldest
 * first, so the most recent is last). The sliding-window cap (keep only the
 * last N) is an implementation concern, deliberately absent from this
 * contract.
 */
export interface TemperatureHistoryRepository {
  record(reading: TemperatureReading): Promise<void>;
  findAll(): Promise<TemperatureReading[]>;
}
