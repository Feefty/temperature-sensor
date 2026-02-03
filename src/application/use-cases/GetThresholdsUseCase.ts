import { IThresholdConfigRepository } from '../../domain/repositories/index.js';
import { ThresholdConfigDTO } from '../dtos/index.js';
import { TemperatureMapper } from '../mappers/index.js';

export class GetThresholdsUseCase {
  constructor(private readonly thresholdConfigRepository: IThresholdConfigRepository) {}

  async execute(): Promise<ThresholdConfigDTO> {
    const config = await this.thresholdConfigRepository.get();

    if (!config) {
      throw new Error('Threshold configuration not found');
    }

    return TemperatureMapper.toThresholdDTO(config);
  }
}
