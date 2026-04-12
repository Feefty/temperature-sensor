import { ITemperatureSensor } from "../../../domain/ports/outbound/i-temperature-sensor";

export class TemperatureSensorAdapter implements ITemperatureSensor {
  async getTemperature(): Promise<number> {
    const temperature = Math.random() * 50;
    return Math.round(temperature * 10) / 10;
  }
}
