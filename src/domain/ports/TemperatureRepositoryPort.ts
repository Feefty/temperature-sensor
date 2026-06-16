import type { TemperatureReading } from "../TemperatureReading.ts";

export interface TemperatureRepositoryPort {
  save(reading: TemperatureReading): Promise<void>;
  findAll(limit: number, offset: number): Promise<TemperatureReading[]>;
  count(): Promise<number>;
}
