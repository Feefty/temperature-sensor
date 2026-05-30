import type { TemperatureSensor } from '../../src/domain/ports/TemperatureSensor';
import { createTemperature, type Temperature } from '../../src/domain/value-objects/Temperature';

export class FakeTemperatureSensor implements TemperatureSensor {
  private next: Temperature;

  constructor(initialCelsius = 20) {
    this.next = createTemperature(initialCelsius);
  }

  setValue(celsius: number): void {
    this.next = createTemperature(celsius);
  }

  read(): Promise<Temperature> {
    return Promise.resolve(this.next);
  }
}
