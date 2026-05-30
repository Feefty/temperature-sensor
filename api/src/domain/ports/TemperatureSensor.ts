import type { Temperature } from '../value-objects/Temperature';

export interface TemperatureSensor {
  read(): Promise<Temperature>;
}
