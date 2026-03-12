import { Threshold } from "../../domain/entities/Threshold";
import { InvalidThresholdError } from "../../domain/errors/InvalidThresholdError";
import { ThresholdRepositoryPort } from "../../domain/ports/ThresholdRepositoryPort";

export class UpdateThresholdsUseCase {
  constructor(private readonly thresholdRepo: ThresholdRepositoryPort) {}

  async execute(coldMax: number, hotMin: number): Promise<Threshold> {
    if (coldMax >= hotMin) {
      throw new InvalidThresholdError(
        "coldMax must be strictly less than hotMin"
      );
    }

    return this.thresholdRepo.update({ coldMax, hotMin });
  }
}
