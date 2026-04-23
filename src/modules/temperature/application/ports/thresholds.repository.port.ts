import { SensorThresholds } from '../../domain/sensor-thresholds';

export const THRESHOLDS_REPOSITORY = Symbol('THRESHOLDS_REPOSITORY');

export interface ThresholdsRepositoryPort {
  get(): Promise<SensorThresholds>;
  update(sensorThresholds: SensorThresholds): Promise<void>;
}
