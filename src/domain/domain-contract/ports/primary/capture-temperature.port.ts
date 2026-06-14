import { TemperatureCapture } from '../../models/temperature-capture.model';

export interface CaptureTemperaturePort {
  execute(): Promise<TemperatureCapture>;
}
