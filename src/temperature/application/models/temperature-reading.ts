import { TemperatureState } from '../../domain/temperature-state';
import { Thresholds } from '../../domain/thresholds';

export type TemperatureReading = Readonly<{
  id: string;
  temperature: number;
  state: TemperatureState;
  thresholds: Thresholds;
  capturedAt: Date;
}>;
