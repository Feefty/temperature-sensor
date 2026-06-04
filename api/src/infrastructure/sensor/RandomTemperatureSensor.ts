import type { TemperatureSensor } from '../../domain/ports/TemperatureSensor';
import { SENSOR_MAX, SENSOR_MIN } from '../../domain/sensorRange';
import { createTemperature, type Temperature } from '../../domain/value-objects/Temperature';

// Stands in for the real TemperatureSensor component. Swap it for the hardware or vendor
// client in production; the random reading keeps the API runnable without hardware.
export class RandomTemperatureSensor implements TemperatureSensor {
  read(): Promise<Temperature> {
    const span = SENSOR_MAX - SENSOR_MIN;
    const celsius = Math.round((Math.random() * span + SENSOR_MIN) * 10) / 10;
    return Promise.resolve(createTemperature(celsius));
  }
}
