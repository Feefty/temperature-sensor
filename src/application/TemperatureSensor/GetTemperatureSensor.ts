
import type { TemperatureSensorRepository } from '../../domain/TemperatureSensor/TemperatureSensorRepository.js';
import type { ThresholdsRepository } from '../../domain/TemperatureSensor/ThresholdsRepository.js';
import { TemperatureSensor } from '../../domain/TemperatureSensor/TemperatureSensor.js';

export class GetTemperatureSensor {
  constructor(
    private temperatureSensorRepository: TemperatureSensorRepository,
    private thresholdsRepository: ThresholdsRepository,
  ) {}

  async execute(): Promise<{ value: number, state: string }> {
    const value = Math.floor(Math.random() * 40)
    const coldThreshold = await this.thresholdsRepository.findCold()
    const hotThreshold = await this.thresholdsRepository.findHot()

    const cold = coldThreshold?.value ?? 22
    const hot = hotThreshold?.value ?? 35

    let state = 'warm'
    if (value <= cold) {
      state = 'cold'
    } else if (value >= hot) {
      state = 'hot'
    }

    const temperatureSensor = new TemperatureSensor('', value, state, null)
    await this.temperatureSensorRepository.save(temperatureSensor)

    return { value: temperatureSensor.value, state: temperatureSensor.state }
  }
}   