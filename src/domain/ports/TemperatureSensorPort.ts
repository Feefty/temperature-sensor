import type { Temperature } from "../Temperature.ts";

export interface TemperatureSensorPort {
  read(): Promise<Temperature>;
}
