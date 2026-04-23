import { createMap, forMember, mapFrom, Mapper } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Injectable } from '@nestjs/common';
import { SensorThresholds } from '../../domain/sensor-thresholds';
import { SensorThresholdsEntity } from '../persistence/temperature-threshold.entity';

@Injectable()
export class SensorThresholdsEntityMapper {
  public constructor(@InjectMapper() private readonly classMapper: Mapper) {}

  public entityToDomain(entity: SensorThresholdsEntity): SensorThresholds {
    return this.classMapper.map(entity, SensorThresholdsEntity, SensorThresholds);
  }

  public domainToEntity(
    domain: SensorThresholds,
    existing: SensorThresholdsEntity
  ): SensorThresholdsEntity {
    const updated: SensorThresholdsEntity = this.classMapper.map(
      domain,
      SensorThresholds,
      SensorThresholdsEntity
    );
    updated.singletonKey = existing.singletonKey;
    updated.updatedAt = new Date();
    return updated;
  }
}

@Injectable()
export class SensorThresholdsEntityMapperProfile extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public get profile(): (mapper: Mapper) => void {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        SensorThresholdsEntity,
        SensorThresholds,
        forMember(
          (dest) => dest.coldBelowCelsius,
          mapFrom((src) => Number.parseFloat(src.coldBelowCelsius))
        ),
        forMember(
          (dest) => dest.hotFromCelsius,
          mapFrom((src) => Number.parseFloat(src.hotFromCelsius))
        )
      );
      createMap(
        mapper,
        SensorThresholds,
        SensorThresholdsEntity,
        forMember(
          (dest) => dest.coldBelowCelsius,
          mapFrom((src) => src.coldBelowCelsius.toFixed(2))
        ),
        forMember(
          (dest) => dest.hotFromCelsius,
          mapFrom((src) => src.hotFromCelsius.toFixed(2))
        )
      );
    };
  }
}
