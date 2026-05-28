import { TemperatureReading } from "../../domain/entities/TemperatureReading";
import { TemperatureHistoryRepository } from "../../domain/repositories/TemperatureHistoryRepository";

export class InMemoryTemperatureRepository implements TemperatureHistoryRepository {
  private data: TemperatureReading[] = [];

  async save(reading: TemperatureReading) {
    this.data.push(reading);
  }

  async findLast(limit: number) {
    return this.data.slice(-limit).reverse();
  }
}