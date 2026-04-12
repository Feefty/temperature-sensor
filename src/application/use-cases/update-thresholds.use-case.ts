import { Thresholds } from "../../domain/entities/thresholds";
import { ThresholdsService } from "../services/thresholds.service";

export class UpdateThresholdsUseCase {
  constructor(private readonly thresholdsService: ThresholdsService) {}

  async execute(hot: number, cold: number): Promise<Thresholds> {
    return this.thresholdsService.update(hot, cold);
  }
}
