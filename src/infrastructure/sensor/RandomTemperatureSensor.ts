import { Temperature } from "@domain/Temperature.ts";
import type { TemperatureSensorPort } from "@domain/ports/TemperatureSensorPort.ts";

export class RandomTemperatureSensor implements TemperatureSensorPort {
  private readonly minCelsius: number;
  private readonly maxCelsius: number;

  constructor(minCelsius = -10, maxCelsius = 50) {
    this.minCelsius = minCelsius;
    this.maxCelsius = maxCelsius;
  }

  async read(): Promise<Temperature> {
    const range = this.maxCelsius - this.minCelsius;
    const celsius =
      Math.round((Math.random() * range + this.minCelsius) * 10) / 10;
    return Temperature.fromCelsius(celsius);
  }
}
