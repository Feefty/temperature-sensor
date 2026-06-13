import { Thresholds } from '../../domain/thresholds';

export interface ThresholdsRepository {
  get(): Promise<Thresholds>;
  save(thresholds: Thresholds): Promise<void>;
}
