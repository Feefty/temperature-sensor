import { ThresholdsRepository } from '../../application/ports/thresholds.repository';
import { DEFAULT_THRESHOLDS, Thresholds } from '../../domain/thresholds';

export class InMemoryThresholdsRepository implements ThresholdsRepository {
  private thresholds: Thresholds = DEFAULT_THRESHOLDS;

  async get(): Promise<Thresholds> {
    return this.thresholds;
  }

  async save(thresholds: Thresholds): Promise<void> {
    this.thresholds = thresholds;
  }
}
