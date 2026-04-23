import { createMap, forMember, mapFrom, Mapper } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Injectable } from '@nestjs/common';
import { TemperatureHistory } from '../../domain/temperature-history.domain';
import { TemperatureHistoryEntity } from '../persistence/temperature-history.entity';

@Injectable()
export class TemperatureHistoryEntityMapper {
  public constructor(@InjectMapper() private readonly classMapper: Mapper) {}

  public entityToDomain(entity: TemperatureHistoryEntity): TemperatureHistory {
    return this.classMapper.map(entity, TemperatureHistoryEntity, TemperatureHistory);
  }

  public domainToEntity(domain: TemperatureHistory): TemperatureHistoryEntity {
    return this.classMapper.map(domain, TemperatureHistory, TemperatureHistoryEntity);
  }

  public entitiesToDomains(entities: TemperatureHistoryEntity[]): TemperatureHistory[] {
    return this.classMapper.mapArray(entities, TemperatureHistoryEntity, TemperatureHistory);
  }

  public domainsToEntities(domains: TemperatureHistory[]): TemperatureHistoryEntity[] {
    return this.classMapper.mapArray(domains, TemperatureHistory, TemperatureHistoryEntity);
  }
}

@Injectable()
export class TemperatureHistoryEntityMapperProfile extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public get profile(): (mapper: Mapper) => void {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        TemperatureHistoryEntity,
        TemperatureHistory,
        forMember(
          (dest) => dest.celsius,
          mapFrom((src) => Number.parseFloat(src.celsius))
        ),
        forMember(
          (dest) => dest.snapshotColdBelow,
          mapFrom((src) => Number.parseFloat(src.snapshotColdBelow))
        ),
        forMember(
          (dest) => dest.snapshotHotFrom,
          mapFrom((src) => Number.parseFloat(src.snapshotHotFrom))
        )
      );
      createMap(
        mapper,
        TemperatureHistory,
        TemperatureHistoryEntity,
        forMember(
          (dest) => dest.celsius,
          mapFrom((src) => src.celsius.toFixed(2))
        ),
        forMember(
          (dest) => dest.snapshotColdBelow,
          mapFrom((src) => src.snapshotColdBelow.toFixed(2))
        ),
        forMember(
          (dest) => dest.snapshotHotFrom,
          mapFrom((src) => src.snapshotHotFrom.toFixed(2))
        )
      );
    };
  }
}
