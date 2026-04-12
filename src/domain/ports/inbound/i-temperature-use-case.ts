import { TemperatureReading } from "../../entities/temperature-reading";

export interface ITemperatureService {
  captureTemperature(): Promise<TemperatureReading>;
  getHistory(): Promise<TemperatureReading[]>;
  updateThresholds(hot: number, cold: number): Promise<void>;
}
