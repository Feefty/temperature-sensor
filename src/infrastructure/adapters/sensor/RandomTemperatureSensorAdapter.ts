import { TemperatureSensorPort } from "../../../domain/ports/TemperatureSensorPort";

export class RandomTemperatureSensorAdapter implements TemperatureSensorPort {
  async read(): Promise<number> {
    const value = Math.round((Math.random() * 60 - 10) * 10) / 10;
    return value;
  }
}
