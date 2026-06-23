import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { TemperatureSensorPort } from './application/ports/temperature-sensor.port';
import { InMemoryTemperatureHistoryRepository } from './infrastructure/persistence/in-memory-temperature-history.repository';
import { InMemoryThresholdsRepository } from './infrastructure/persistence/in-memory-thresholds.repository';
import { TemperatureSensor } from './infrastructure/sensors/temperature-sensor';
import { TemperatureSensorAdapter } from './infrastructure/sensors/temperature-sensor.adapter';
import { SystemClockAdapter } from './infrastructure/system/system-clock.adapter';
import { UuidIdGeneratorAdapter } from './infrastructure/system/uuid-id-generator.adapter';
import { TemperatureController } from './interface/http/temperature.controller';
import { ThresholdValidationExceptionFilter } from './interface/http/threshold-validation-exception.filter';
import { ThresholdsController } from './interface/http/thresholds.controller';
import { TemperatureApplicationService } from './temperature-application.service';
import {
  CLOCK_PORT,
  ID_GENERATOR_PORT,
  TEMPERATURE_HISTORY_REPOSITORY,
  TEMPERATURE_SENSOR_PORT,
  THRESHOLDS_REPOSITORY,
} from './temperature.tokens';

@Module({
  controllers: [TemperatureController, ThresholdsController],
  providers: [
    {
      provide: TEMPERATURE_HISTORY_REPOSITORY,
      useClass: InMemoryTemperatureHistoryRepository,
    },
    {
      provide: THRESHOLDS_REPOSITORY,
      useClass: InMemoryThresholdsRepository,
    },
    {
      provide: TEMPERATURE_SENSOR_PORT,
      useFactory: (): TemperatureSensorPort =>
        new TemperatureSensorAdapter(
          new TemperatureSensor(process.env, Math.random),
        ),
    },
    { provide: CLOCK_PORT, useClass: SystemClockAdapter },
    { provide: ID_GENERATOR_PORT, useClass: UuidIdGeneratorAdapter },
    TemperatureApplicationService,
    {
      provide: APP_FILTER,
      useClass: ThresholdValidationExceptionFilter,
    },
  ],
})
export class TemperatureModule {}
