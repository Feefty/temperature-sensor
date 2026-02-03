export interface ITemperatureSensor {
  read(): Promise<number>;
}
