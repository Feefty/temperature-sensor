import type { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { createTemperature, type Temperature } from '../../domain/value-objects/Temperature';

// Stands in for the real TemperatureSensor component. Swap it for the hardware or vendor
// client in production; the random reading keeps the API runnable without hardware.
export class RandomTemperatureSensor implements TemperatureSensor {
  read(): Promise<Temperature> {
    const celsius = Math.round((Math.random() * 60 - 10) * 10) / 10; // -10.0 to 50.0
    return Promise.resolve(createTemperature(celsius));
  }
}
