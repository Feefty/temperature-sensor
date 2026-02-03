import { IThresholdConfigRepository } from '../../domain/repositories/index.js';
import { UpdateThresholdsDTO, ThresholdConfigDTO } from '../dtos/index.js';
import { TemperatureMapper } from '../mappers/index.js';

export class UpdateThresholdsUseCase {
  constructor(private readonly thresholdConfigRepository: IThresholdConfigRepository) {}

  async execute(dto: UpdateThresholdsDTO): Promise<ThresholdConfigDTO> {
    const currentConfig = await this.thresholdConfigRepository.get();

    if (!currentConfig) {
      throw new Error('Threshold configuration not found');
    }

    const updatedConfig = currentConfig.withUpdatedThresholds(
      dto.hotThreshold,
      dto.coldThreshold
    );

    const savedConfig = await this.thresholdConfigRepository.update(updatedConfig);

    return TemperatureMapper.toThresholdDTO(savedConfig);
  }
}
