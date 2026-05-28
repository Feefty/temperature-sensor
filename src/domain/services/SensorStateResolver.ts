import { SensorState } from '../entities/SensorState';
import { Thresholds } from '../entities/Thresholds';

export class SensorStateResolver {
  static resolve(temperature: number, thresholds: Thresholds): SensorState {
    if (temperature < thresholds.coldMax) {
      return SensorState.COLD;
    }

    if (temperature >= thresholds.hotMin) {
      return SensorState.HOT;
    }

    return SensorState.WARM;
  }
}