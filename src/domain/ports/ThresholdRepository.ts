import { Thresholds } from "../entities/Thresholds";

export interface ThresholdRepository {
  get(): Promise<Thresholds>;
  set(t: Thresholds): Promise<void>;
}