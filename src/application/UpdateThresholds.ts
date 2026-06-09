import { ThresholdsRepository } from '../domain/ports/ThresholdsRepository';
import { Celsius } from '../domain/temperature/Celsius';
import { Thresholds } from '../domain/temperature/Thresholds';

export interface UpdateThresholdsInput {
  cold: Celsius;
  hot: Celsius;
}

/**
 * Redefines the active thresholds at runtime. Validation lives in the
 * Thresholds value object, so an invalid combination raises
 * InvalidThresholdsError and the stored thresholds are left untouched.
 */
export class UpdateThresholds {
  constructor(private readonly thresholds: ThresholdsRepository) {}

  async execute(input: UpdateThresholdsInput): Promise<Thresholds> {
    const thresholds = Thresholds.create(input.cold, input.hot);
    await this.thresholds.save(thresholds);
    return thresholds;
  }
}
