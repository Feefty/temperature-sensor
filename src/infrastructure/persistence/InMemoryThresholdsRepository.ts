import { Thresholds } from "@domain/Thresholds.ts";
import type { ThresholdsRepositoryPort } from "@domain/ports/ThresholdsRepositoryPort.ts";

export class InMemoryThresholdsRepository implements ThresholdsRepositoryPort {
  private thresholds: Thresholds = Thresholds.default();

  async get(): Promise<Thresholds> {
    return this.thresholds;
  }

  async update(thresholds: Thresholds): Promise<void> {
    this.thresholds = thresholds;
  }
}
