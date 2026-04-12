export interface ITemperatureSensor {
  getTemperature(): Promise<number>;
}
