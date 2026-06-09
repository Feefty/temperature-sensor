import { TemperatureSensor } from '../../src/domain/ports/TemperatureSensor';
import { Celsius } from '../../src/domain/temperature/Celsius';

/**
 * Test double for the {@link TemperatureSensor} port: returns a temperature the
 * test pins explicitly, so use cases can be exercised without real hardware or
 * randomness.
 */
export class FakeTemperatureSensor implements TemperatureSensor {
  constructor(private celsius: Celsius) {}

  setNext(celsius: Celsius): void {
    this.celsius = celsius;
  }

  async read(): Promise<Celsius> {
    return this.celsius;
  }
}
