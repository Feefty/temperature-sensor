import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@shared/common/logger/logger.module';
import { GetCurrentTemperatureUseCase } from './application/use-cases/get-current-temperature.use-case';
import { GetTemperatureHistoryUseCase } from './application/use-cases/get-temperature-history.use-case';
import { GetThresholdsUseCase } from './application/use-cases/get-thresholds.use-case';
import { UpdateThresholdsUseCase } from './application/use-cases/update-thresholds.use-case';
import { TEMPERATURE_HISTORY_REPOSITORY } from './application/ports/temperature-history.repository.port';
import { TEMPERATURE_SENSOR } from './application/ports/temperature-sensor.port';
import { THRESHOLDS_REPOSITORY } from './application/ports/thresholds.repository.port';
import { SimulatedTemperatureSensorAdapter } from './infrastructure/adapters/simulated-temperature-sensor.adapter';
import { TemperatureHistoryEntity } from './infrastructure/persistence/temperature-history.entity';
import { SensorThresholdsEntity } from './infrastructure/persistence/temperature-threshold.entity';
import { TemperatureHistoryTypeOrmRepository } from './infrastructure/persistence/temperature-history.typeorm.repository';
import { SensorThresholdssTypeOrmRepository } from './infrastructure/persistence/temperature-thresholds.typeorm.repository';
import {
  TemperatureHistoryEntityMapper,
  TemperatureHistoryEntityMapperProfile,
} from './infrastructure/mappers/temperature-history-entity.mapper';
import {
  SensorThresholdsEntityMapper,
  SensorThresholdsEntityMapperProfile,
} from './infrastructure/mappers/temperature-threshold-entity.mapper';
import {
  TemperatureDtoMapper,
  TemperatureDtoMapperProfile,
} from './presentation/mappers/temperature-dto.mapper';
import { TemperatureController } from './presentation/temperature.controller';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([TemperatureHistoryEntity, SensorThresholdsEntity])],
  controllers: [TemperatureController],
  providers: [
    // Use cases
    GetCurrentTemperatureUseCase,
    GetTemperatureHistoryUseCase,
    GetThresholdsUseCase,
    UpdateThresholdsUseCase,
    // Infrastructure port bindings
    { provide: TEMPERATURE_SENSOR, useClass: SimulatedTemperatureSensorAdapter },
    { provide: TEMPERATURE_HISTORY_REPOSITORY, useClass: TemperatureHistoryTypeOrmRepository },
    { provide: THRESHOLDS_REPOSITORY, useClass: SensorThresholdssTypeOrmRepository },
    // Entity mappers + profiles
    TemperatureHistoryEntityMapper,
    TemperatureHistoryEntityMapperProfile,
    SensorThresholdsEntityMapper,
    SensorThresholdsEntityMapperProfile,
    // DTO mapper + profile
    TemperatureDtoMapper,
    TemperatureDtoMapperProfile,
  ],
})
export class TemperatureModule {}
