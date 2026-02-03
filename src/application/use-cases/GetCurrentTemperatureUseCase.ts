import { randomUUID } from 'crypto';
import { Temperature } from '../../domain/entities/index.js';
import { TemperatureStateService } from '../../domain/services/index.js';
import { ITemperatureRepository, IThresholdConfigRepository } from '../../domain/repositories/index.js';
import { ITemperatureSensor } from '../interfaces/index.js';
import { TemperatureResponseDTO } from '../dtos/index.js';
import { TemperatureMapper } from '../mappers/index.js';

export class GetCurrentTemperatureUseCase {
  constructor(
    private readonly sensor: ITemperatureSensor,
    private readonly temperatureRepository: ITemperatureRepository,
    private readonly thresholdConfigRepository: IThresholdConfigRepository
  ) {}

  async execute(): Promise<TemperatureResponseDTO> {
    const rawTemperature = await this.sensor.read();
    const thresholdConfig = await this.thresholdConfigRepository.get();

    if (!thresholdConfig) {
      throw new Error('Threshold configuration not found');
    }

    const state = TemperatureStateService.calculateState(rawTemperature, thresholdConfig);
    const temperature = Temperature.create(randomUUID(), rawTemperature, state);

    await this.temperatureRepository.save(temperature);

    return TemperatureMapper.toDTO(temperature);
  }
}
