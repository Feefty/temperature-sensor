import { TemperatureState } from './temperature-state.enum';

export interface TemperatureCapture {
  readonly id: string;
  readonly value: number;
  readonly state: TemperatureState;
  readonly capturedAt: Date;
}
