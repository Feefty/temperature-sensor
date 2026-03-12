export interface TemperatureSensorPort {
  read(): Promise<number>;
}
