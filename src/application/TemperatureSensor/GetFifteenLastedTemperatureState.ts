import type { TemperatureSensorRepository } from '../../domain/TemperatureSensor/TemperatureSensorRepository.js'
import type { TemperatureSensor } from '../../domain/TemperatureSensor/TemperatureSensor.js'

export class GetFifteenLastedTemperatureState {
  constructor(private temperatureSensorRepository: TemperatureSensorRepository) {}

  async execute(): Promise<TemperatureSensor[]> {
    return this.temperatureSensorRepository.getFifteenLastedTemperatureState()
  }
}
