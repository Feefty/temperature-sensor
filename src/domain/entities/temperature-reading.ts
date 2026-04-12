import { SensorState } from "../value-objects/sensor-state";
import { Thresholds } from "./thresholds";

export class TemperatureReading {
  public readonly temperature: number;
  public readonly state: SensorState;

  private constructor(temperature: number, state: SensorState) {
    this.temperature = temperature;
    this.state = state;
  }

  static create(temperature: number, thresholds: Thresholds): TemperatureReading {
    const state = thresholds.computeState(temperature);
    return new TemperatureReading(temperature, state);
  }
}
