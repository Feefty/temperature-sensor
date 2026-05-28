import { TemperatureRepository } from "../../domain/ports/TemperatureRepository";

export class GetTemperatureHistoryUseCase {
  constructor(private repo: TemperatureRepository) {}

  async execute() {
    return this.repo.findLast(15);
  }
}