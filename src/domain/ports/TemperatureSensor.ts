import { Celsius } from '../temperature/Celsius';

/**
 * Driven port for the external temperature sensor component. Reading is async
 * because a real sensor read is I/O; the fake used in tests resolves a fixed
 * value.
 */
export interface TemperatureSensor {
  read(): Promise<Celsius>;
}
