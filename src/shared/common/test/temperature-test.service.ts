import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@shared/common/logger/logger.service';
import { ConfigSensorModel } from '@shared/config/models/config-sensor.model';
import { TemperatureHistoryEntity } from '@modules/temperature/infrastructure/persistence/temperature-history.entity';
import { SensorThresholdsEntity } from '@modules/temperature/infrastructure/persistence/temperature-threshold.entity';

@Injectable()
export class TemperatureTestService {
  private readonly singletonKey: number;

  public constructor(
    @InjectRepository(TemperatureHistoryEntity)
    private readonly historyRepository: Repository<TemperatureHistoryEntity>,
    @InjectRepository(SensorThresholdsEntity)
    private readonly thresholdRepository: Repository<SensorThresholdsEntity>,
    private readonly logger: Logger,
    configService: ConfigService
  ) {
    this.singletonKey = configService.getOrThrow<ConfigSensorModel>('sensor').thresholdSingletonKey;
  }

  public async clearHistory(): Promise<void> {
    try {
      await this.historyRepository.clear();
      this.logger.log('temperature_history cleared');
    } catch (err: unknown) {
      this.logger.error('Failed to clear temperature_history', err);
    }
  }

  public async resetThresholds(coldBelow: number = 22, hotFrom: number = 35): Promise<void> {
    await this.thresholdRepository.update(
      { singletonKey: this.singletonKey },
      {
        coldBelowCelsius: coldBelow.toFixed(2),
        hotFromCelsius: hotFrom.toFixed(2),
        updatedAt: new Date(),
      }
    );
  }

  public async ensureSingletonThresholds(coldBelow: number = 22, hotFrom: number = 35): Promise<void> {
    const existingEntity: SensorThresholdsEntity | null = await this.thresholdRepository.findOne({
      where: { singletonKey: this.singletonKey },
    });
    if (!existingEntity) {
      await this.thresholdRepository.insert({
        singletonKey: this.singletonKey,
        coldBelowCelsius: coldBelow.toFixed(2),
        hotFromCelsius: hotFrom.toFixed(2),
        updatedAt: new Date(),
      });
      return;
    }
    await this.resetThresholds(coldBelow, hotFrom);
  }

  public async deleteThresholdSingleton(): Promise<void> {
    await this.thresholdRepository.delete({ singletonKey: this.singletonKey });
  }
}
