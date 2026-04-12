import { TemperatureReading } from "../../../domain/entities/temperature-reading";
import { IReadingRepository } from "../../../domain/ports/outbound/i-reading-repository";

export class InMemoryReadingRepository implements IReadingRepository {
  private static readonly MAX_SIZE = 15;
  private readings: TemperatureReading[] = [];

  async save(reading: TemperatureReading): Promise<void> {
    this.readings.push(reading);

    if (this.readings.length > InMemoryReadingRepository.MAX_SIZE) {
      this.readings = this.readings.slice(-InMemoryReadingRepository.MAX_SIZE);
    }
  }

  async getLastFifteen(): Promise<TemperatureReading[]> {
    return [...this.readings];
  }
}
