import { Thresholds } from "../../domain/entities/thresholds";

export class ThresholdsService {
  private thresholds: Thresholds;

  constructor(thresholds: Thresholds = new Thresholds()) {
    this.thresholds = thresholds;
  }

  get(): Thresholds {
    return this.thresholds;
  }

  update(hot: number, cold: number): Thresholds {
    this.thresholds = new Thresholds(hot, cold);
    return this.thresholds;
  }
}
