export interface TemperatureSensorPort {
  readTemperature(): Promise<number>;
}
