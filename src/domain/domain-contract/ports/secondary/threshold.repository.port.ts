import { Threshold } from '../../models/threshold.model';

export interface ThresholdRepositoryPort {
  getCurrent(): Promise<Threshold | null>;
  update(coldMax: number, hotMin: number): Promise<Threshold>;
}
