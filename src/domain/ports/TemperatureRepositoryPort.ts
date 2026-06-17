import type { TemperatureReading } from "../TemperatureReading.ts";

export interface TemperatureRepositoryPort {
  save(reading: TemperatureReading): Promise<void>;
  findLast(count: number): Promise<TemperatureReading[]>;
}
