import { TemperatureReading } from "../../entities/temperature-reading";

export interface IReadingRepository {
  save(reading: TemperatureReading): Promise<void>;
  getLastFifteen(): Promise<TemperatureReading[]>;
}
