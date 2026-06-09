import { ThresholdsRepository } from '../../domain/ports/ThresholdsRepository';
import { Thresholds } from '../../domain/temperature/Thresholds';

/**
 * In-memory {@link ThresholdsRepository}. Holds the currently active thresholds
 * and replaces them wholesale on `save`. Seeded at construction (the composition
 * root supplies `Thresholds.default()`). No defensive copy is needed because
 * `Thresholds` is immutable.
 */
export class InMemoryThresholdsRepository implements ThresholdsRepository {
  constructor(private current: Thresholds) {}

  async get(): Promise<Thresholds> {
    return this.current;
  }

  async save(thresholds: Thresholds): Promise<void> {
    this.current = thresholds;
  }
}
