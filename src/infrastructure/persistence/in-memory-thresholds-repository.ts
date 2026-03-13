import type { Thresholds } from '../../domain/temperature-state';
import { DEFAULT_THRESHOLDS } from '../../domain/thresholds';

export class InMemoryThresholdsRepository {
  private thresholds: Thresholds = { ...DEFAULT_THRESHOLDS };

  get(): Thresholds {
    return { ...this.thresholds };
  }

  set(thresholds: Thresholds): void {
    this.thresholds = { ...thresholds };
  }
}
