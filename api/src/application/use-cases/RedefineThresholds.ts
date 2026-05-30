import type { ReadingRepository } from '../../domain/ports/ReadingRepository';
import { createThresholds, type Thresholds } from '../../domain/value-objects/Thresholds';

export interface RedefineThresholdsInput {
  coldMax: number;
  hotMin: number;
}

export class RedefineThresholds {
  constructor(private readonly repository: ReadingRepository) {}

  // Applies to future captures only; existing history keeps the state recorded at capture time.
  async execute(input: RedefineThresholdsInput): Promise<Thresholds> {
    const thresholds = createThresholds(input.coldMax, input.hotMin);
    await this.repository.setThresholds(thresholds);
    return thresholds;
  }
}
