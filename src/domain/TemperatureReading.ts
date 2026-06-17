import type { SensorState } from "./SensorState.ts";

export interface TemperatureReading {
  id: string;
  temperatureCelsius: number;
  state: SensorState;
  timestamp: string;
}
