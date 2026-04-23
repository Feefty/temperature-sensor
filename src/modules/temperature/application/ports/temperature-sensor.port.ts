export const TEMPERATURE_SENSOR = Symbol('TEMPERATURE_SENSOR');

export interface TemperatureSensorPort {
  readCelsius(): Promise<number>;
}
