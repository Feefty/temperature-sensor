import { SensorState } from './SensorState';

export interface TemperatureReading {
  value: number;
  state: SensorState;
  timestamp: Date;
}