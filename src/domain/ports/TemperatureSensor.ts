export interface TemperatureSensor {
  getTemperature(): Promise<number>;
}