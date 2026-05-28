import { Thresholds } from "../../domain/entities/Thresholds";
import { ThresholdRepository } from "../../domain/ports/ThresholdRepository";

export class UpdateThresholdsUseCase {
  constructor(private repo: ThresholdRepository) {}

  async execute(t: Thresholds) {
    await this.repo.set(t);
  }
}