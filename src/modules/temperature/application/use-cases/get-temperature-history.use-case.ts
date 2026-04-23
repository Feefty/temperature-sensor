import { Inject, Injectable } from '@nestjs/common';
import { TemperatureHistory } from '../../domain/temperature-history.domain';
import {
  TEMPERATURE_HISTORY_REPOSITORY,
  TemperatureHistoryRepositoryPort,
} from '../ports/temperature-history.repository.port';
import { ConfigService } from '@nestjs/config';
import { ConfigSensorModel } from '@shared/config/models/config-sensor.model';

@Injectable()
export class GetTemperatureHistoryUseCase {
  private readonly historySize: number;

  public constructor(
    @Inject(TEMPERATURE_HISTORY_REPOSITORY)
    private readonly temperatureHistoryRepository: TemperatureHistoryRepositoryPort,
    config: ConfigService
  ) {
    this.historySize = config.getOrThrow<ConfigSensorModel>('sensor').historySize;
  }

  public async execute(): Promise<TemperatureHistory[]> {
    const items: TemperatureHistory[] = await this.temperatureHistoryRepository.findLast(this.historySize);
    // Contract: return oldest-first for stable API responses.
    return items.sort((a, b) => a.capturedAt.getTime() - b.capturedAt.getTime());
  }
}
