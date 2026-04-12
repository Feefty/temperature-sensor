import { SensorState } from "../value-objects/sensor-state";
import { InvalidThresholdError } from "../../shared/errors/invalid-threshold.error";

export class Thresholds {
  public readonly hotThreshold: number;
  public readonly coldThreshold: number;

  constructor(hotThreshold: number = 35, coldThreshold: number = 22) {
    if (coldThreshold >= hotThreshold) {
      throw new InvalidThresholdError(coldThreshold, hotThreshold);
    }

    this.hotThreshold = hotThreshold;
    this.coldThreshold = coldThreshold;
  }

  computeState(temperature: number): SensorState {
    if (temperature >= this.hotThreshold) {
      return SensorState.HOT;
    }

    if (temperature < this.coldThreshold) {
      return SensorState.COLD;
    }

    return SensorState.WARM;
  }
}
