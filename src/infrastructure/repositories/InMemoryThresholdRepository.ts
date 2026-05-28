import { Thresholds } from "../../domain/entities/Thresholds";
import { ThresholdRepository } from "../../domain/ports/ThresholdRepository";

export class InMemoryThresholdRepository implements ThresholdRepository {
  private thresholds: Thresholds = {
    coldMax: 22,
    hotMin: 35,
  };

  async get() {
    return this.thresholds;
  }

  async set(t: Thresholds) {
    this.thresholds = t;
  }
}