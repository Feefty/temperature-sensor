import { SensorState } from "./SensorState";

export interface Temperature {
  id: string;
  value: number;
  state: SensorState;
  recordedAt: Date;
}
