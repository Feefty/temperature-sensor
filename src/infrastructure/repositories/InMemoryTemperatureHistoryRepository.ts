import { TemperatureHistoryRepository } from '../../domain/repositories/TemperatureHistoryRepository';
import { TemperatureReading } from '../../domain/entities/TemperatureReading';

export class InMemoryTemperatureHistoryRepository implements TemperatureHistoryRepository {
  private storage: TemperatureReading[] = [];

  async save(reading: TemperatureReading): Promise<void> {
    this.storage.push(reading);

    if (this.storage.length > 15) {
      this.storage = this.storage.slice(-15);
    }
  }

  async findLast(limit: number): Promise<TemperatureReading[]> {
    return this.storage.slice(-limit);
  }
}