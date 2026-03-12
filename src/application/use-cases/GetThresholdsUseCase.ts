import { Threshold } from "../../domain/entities/Threshold";
import { ThresholdRepositoryPort } from "../../domain/ports/ThresholdRepositoryPort";

export class GetThresholdsUseCase {
  constructor(private readonly thresholdRepo: ThresholdRepositoryPort) {}

  async execute(): Promise<Threshold> {
    return this.thresholdRepo.get();
  }
}
