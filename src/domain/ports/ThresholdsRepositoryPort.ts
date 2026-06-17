import type { Thresholds } from "../Thresholds.ts";

export interface ThresholdsRepositoryPort {
  get(): Promise<Thresholds>;
  update(thresholds: Thresholds): Promise<void>;
}
