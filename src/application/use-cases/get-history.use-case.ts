import { TemperatureReading } from "../../domain/entities/temperature-reading";
import { IReadingRepository } from "../../domain/ports/outbound/i-reading-repository";

export class GetHistoryUseCase {
  constructor(private readonly repository: IReadingRepository) {}

  async execute(): Promise<TemperatureReading[]> {
    return this.repository.getLastFifteen();
  }
}
