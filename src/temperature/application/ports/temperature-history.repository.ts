import { TemperatureReading } from '../models/temperature-reading';

export interface TemperatureHistoryRepository {
  save(reading: TemperatureReading): Promise<void>;
  findRecent(limit: number): Promise<TemperatureReading[]>;
}
