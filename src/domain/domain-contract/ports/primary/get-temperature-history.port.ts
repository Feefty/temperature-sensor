import { TemperatureCapture } from '../../models/temperature-capture.model';

export interface GetTemperatureHistoryPort {
  execute(): Promise<TemperatureCapture[]>;
}
