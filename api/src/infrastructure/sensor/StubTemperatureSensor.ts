import type { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { createTemperature, type Temperature } from '../../domain/value-objects/Temperature';

// Placeholder for the real TemperatureSensor component. Swap for the hardware or vendor
// client in production; the random reading keeps the API demonstrable without hardware.
export class StubTemperatureSensor implements TemperatureSensor {
  read(): Promise<Temperature> {
    const celsius = Math.round((Math.random() * 60 - 10) * 10) / 10; // -10.0 .. 50.0
    return Promise.resolve(createTemperature(celsius));
  }
}
