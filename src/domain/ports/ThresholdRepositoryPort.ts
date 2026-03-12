import { Threshold } from "../entities/Threshold";

export interface ThresholdRepositoryPort {
  get(): Promise<Threshold>;
  update(threshold: Threshold): Promise<Threshold>;
}
