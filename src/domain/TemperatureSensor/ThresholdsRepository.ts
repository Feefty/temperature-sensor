import type { Thresholds } from "./Thresholds.js";

export interface ThresholdsRepository {
  saveCold(threshold: Thresholds): Promise<void>;
  saveHot(threshold: Thresholds): Promise<void>;
  findCold(): Promise<Thresholds | null>;
  findHot(): Promise<Thresholds | null>;

}