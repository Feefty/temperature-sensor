import type { TemperatureReading } from "@domain/TemperatureReading.ts";
import type { TemperatureRepositoryPort } from "@domain/ports/TemperatureRepositoryPort.ts";

export class InMemoryTemperatureRepository implements TemperatureRepositoryPort {
  private readings: TemperatureReading[] = [];

  async save(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);
  }

  async findLast(count: number): Promise<TemperatureReading[]> {
    return this.readings.slice(-count).reverse();
  }
}
