import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger as AppLogger } from '@shared/common/logger/logger.service';
import { EntityNotFoundException } from '@shared/common/error-handling/domain/exceptions/entity-not-found.exception';
import { ConfigSensorModel } from '@shared/config/models/config-sensor.model';
import { SensorThresholds } from '../../domain/sensor-thresholds';
import { ThresholdsRepositoryPort } from '../../application/ports/thresholds.repository.port';
import { SensorThresholdsEntity } from './temperature-threshold.entity';
import { SensorThresholdsEntityMapper } from '../mappers/temperature-threshold-entity.mapper';

@Injectable()
export class SensorThresholdssTypeOrmRepository implements ThresholdsRepositoryPort {
  private readonly singletonKey: number;

  public constructor(
    @InjectRepository(SensorThresholdsEntity)
    private readonly repository: Repository<SensorThresholdsEntity>,
    private readonly mapper: SensorThresholdsEntityMapper,
    private readonly logger: AppLogger,
    config: ConfigService
  ) {
    this.singletonKey = config.getOrThrow<ConfigSensorModel>('sensor').thresholdSingletonKey;
  }

  public async get(): Promise<SensorThresholds> {
    const entity: SensorThresholdsEntity | null = await this.repository.findOne({
      where: { singletonKey: this.singletonKey },
    });
    if (!entity) {
      this.logger.error('SensorThresholds row not found (singleton)', {
        entity: 'SensorThresholds',
        singletonKey: this.singletonKey,
      });
      throw new EntityNotFoundException('SensorThresholds', String(this.singletonKey));
    }
    return this.mapper.entityToDomain(entity);
  }

  public async update(thresholds: SensorThresholds): Promise<void> {
    const entity: SensorThresholdsEntity | null = await this.repository.findOne({
      where: { singletonKey: this.singletonKey },
    });
    if (!entity) {
      this.logger.error('SensorThresholds row not found on update (singleton)', {
        entity: 'SensorThresholds',
        singletonKey: this.singletonKey,
      });
      throw new EntityNotFoundException('SensorThresholds', String(this.singletonKey));
    }
    const updatedEntity: SensorThresholdsEntity = this.mapper.domainToEntity(thresholds, entity);
    await this.repository.save(updatedEntity);
  }
}
