import type { TemperatureSensor } from './TemperatureSensor.js'

export interface TemperatureSensorRepository {
  get50LastedTemperatureState(): Promise<TemperatureSensor[]> 
  save(temperatureSensor: TemperatureSensor): Promise<TemperatureSensor>
  updateState(value: number, state: string): Promise<void>
}
