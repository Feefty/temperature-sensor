import { TemperatureState } from '../entities/TemperatureState.js';
import { ThresholdConfig } from '../entities/ThresholdConfig.js';

export class TemperatureStateService {
  static calculateState(temperature: number, config: ThresholdConfig): TemperatureState {
    if (temperature >= config.hotThreshold) {
      return TemperatureState.HOT;
    }
    if (temperature < config.coldThreshold) {
      return TemperatureState.COLD;
    }
    return TemperatureState.WARM;
  }
}
