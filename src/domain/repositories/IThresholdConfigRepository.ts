import { ThresholdConfig } from '../entities/ThresholdConfig.js';

export interface IThresholdConfigRepository {
  get(): Promise<ThresholdConfig | null>;
  save(config: ThresholdConfig): Promise<ThresholdConfig>;
  update(config: ThresholdConfig): Promise<ThresholdConfig>;
}
