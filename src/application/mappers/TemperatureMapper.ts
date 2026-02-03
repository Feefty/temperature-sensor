import { Temperature, ThresholdConfig } from '../../domain/entities/index.js';
import { TemperatureResponseDTO, ThresholdConfigDTO } from '../dtos/index.js';

export class TemperatureMapper {
  static toDTO(temperature: Temperature): TemperatureResponseDTO {
    return {
      id: temperature.id,
      value: temperature.value,
      state: temperature.state,
      timestamp: temperature.timestamp.toISOString()
    };
  }

  static toThresholdDTO(config: ThresholdConfig): ThresholdConfigDTO {
    return {
      id: config.id,
      hotThreshold: config.hotThreshold,
      coldThreshold: config.coldThreshold,
      updatedAt: config.updatedAt.toISOString()
    };
  }
}
