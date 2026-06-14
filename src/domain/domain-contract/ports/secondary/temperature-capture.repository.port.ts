import { TemperatureCapture } from '../../models/temperature-capture.model';

export interface TemperatureCaptureRepositoryPort {
  save(capture: TemperatureCapture): Promise<void>;
  findLastN(count: number): Promise<TemperatureCapture[]>;
}
