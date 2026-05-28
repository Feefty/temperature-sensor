import { TemperatureReading } from "../entities/TemperatureReading";

export interface TemperatureRepository {
  save(reading: TemperatureReading): Promise<void>;
  findLast(limit: number): Promise<TemperatureReading[]>;
}