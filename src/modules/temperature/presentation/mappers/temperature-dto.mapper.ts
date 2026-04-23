import { createMap, Mapper } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Injectable } from '@nestjs/common';
import { SensorThresholds } from '../../domain/sensor-thresholds';
import { TemperatureHistory } from '../../domain/temperature-history.domain';
import { CurrentTemperatureResult } from '../../domain/current-temperature-result';
import { UpdateThresholdsDto } from '../dto/update-thresholds.dto';
import { CurrentTemperatureResponseDto } from '../dto/current-temperature-response.dto';
import { TemperatureHistoryResponseDto } from '../dto/temperature-history-response.dto';
import { SensorThresholdsResponseDto } from '../dto/sensor-thresholds-response.dto';

@Injectable()
export class TemperatureDtoMapper {
  public constructor(@InjectMapper() private readonly classMapper: Mapper) { }

  public updateThresholdsDtoToDomain(updateThresholdsDto: UpdateThresholdsDto): SensorThresholds {
    const sensorThresholds: SensorThresholds = new SensorThresholds();
    sensorThresholds.coldBelowCelsius = updateThresholdsDto.coldBelowCelsius;
    sensorThresholds.hotFromCelsius = updateThresholdsDto.hotFromCelsius;
    return sensorThresholds;
  }

  public currentResultToDto(currentTemperatureResult: CurrentTemperatureResult): CurrentTemperatureResponseDto {
    return this.classMapper.map(currentTemperatureResult, CurrentTemperatureResult, CurrentTemperatureResponseDto);
  }

  public domainToDto(temperatureHistory: TemperatureHistory): TemperatureHistoryResponseDto {
    return this.classMapper.map(temperatureHistory, TemperatureHistory, TemperatureHistoryResponseDto);
  }

  public domainsToDto(temperatureHistories: TemperatureHistory[]): TemperatureHistoryResponseDto[] {
    return this.classMapper.mapArray(temperatureHistories, TemperatureHistory, TemperatureHistoryResponseDto);
  }

  public thresholdsDomainToDto(sensorThresholds: SensorThresholds): SensorThresholdsResponseDto {
    return this.classMapper.map(sensorThresholds, SensorThresholds, SensorThresholdsResponseDto);
  }
}

@Injectable()
export class TemperatureDtoMapperProfile extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public get profile(): (mapper: Mapper) => void {
    return (mapper: Mapper): void => {
      createMap(mapper, TemperatureHistory, TemperatureHistoryResponseDto);
      createMap(mapper, CurrentTemperatureResult, CurrentTemperatureResponseDto);
      createMap(mapper, SensorThresholds, SensorThresholdsResponseDto);
    };
  }
}
