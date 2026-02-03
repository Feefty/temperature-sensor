import { ITemperatureRepository } from '../../domain/repositories/index.js';
import { TemperatureHistoryDTO } from '../dtos/index.js';
import { TemperatureMapper } from '../mappers/index.js';

const HISTORY_LIMIT = 15;

export class GetTemperatureHistoryUseCase {
  constructor(private readonly temperatureRepository: ITemperatureRepository) {}

  async execute(): Promise<TemperatureHistoryDTO> {
    const temperatures = await this.temperatureRepository.findLast(HISTORY_LIMIT);

    return {
      records: temperatures.map(TemperatureMapper.toDTO),
      count: temperatures.length
    };
  }
}
