import { Inject, Injectable } from '@nestjs/common';

import type { TemperatureReading } from './application/models/temperature-reading';
import type { ClockPort } from './application/ports/clock.port';
import type { IdGeneratorPort } from './application/ports/id-generator.port';
import type { TemperatureHistoryRepository } from './application/ports/temperature-history.repository';
import type { TemperatureSensorPort } from './application/ports/temperature-sensor.port';
import type { ThresholdsRepository } from './application/ports/thresholds.repository';
import { captureCurrentTemperature } from './application/use-cases/capture-current-temperature.use-case';
import { getTemperatureHistory } from './application/use-cases/get-temperature-history.use-case';
import type { TemperatureHistory } from './application/use-cases/get-temperature-history.use-case';
import { getThresholds } from './application/use-cases/get-thresholds.use-case';
import { updateThresholds } from './application/use-cases/update-thresholds.use-case';
import type { ThresholdUpdate } from './application/use-cases/update-thresholds.use-case';
import type { Thresholds } from './domain/thresholds';
import {
  CLOCK_PORT,
  ID_GENERATOR_PORT,
  TEMPERATURE_HISTORY_REPOSITORY,
  TEMPERATURE_SENSOR_PORT,
  THRESHOLDS_REPOSITORY,
} from './temperature.tokens';

@Injectable()
export class TemperatureApplicationService {
  constructor(
    @Inject(TEMPERATURE_SENSOR_PORT)
    private readonly sensor: TemperatureSensorPort,
    @Inject(THRESHOLDS_REPOSITORY)
    private readonly thresholdsRepository: ThresholdsRepository,
    @Inject(TEMPERATURE_HISTORY_REPOSITORY)
    private readonly historyRepository: TemperatureHistoryRepository,
    @Inject(CLOCK_PORT)
    private readonly clock: ClockPort,
    @Inject(ID_GENERATOR_PORT)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  captureCurrentTemperature(): Promise<TemperatureReading> {
    return captureCurrentTemperature({
      sensor: this.sensor,
      thresholdsRepository: this.thresholdsRepository,
      historyRepository: this.historyRepository,
      clock: this.clock,
      idGenerator: this.idGenerator,
    });
  }

  getTemperatureHistory(): Promise<TemperatureHistory> {
    return getTemperatureHistory({ historyRepository: this.historyRepository });
  }

  getThresholds(): Promise<Thresholds> {
    return getThresholds({ thresholdsRepository: this.thresholdsRepository });
  }

  updateThresholds(update: ThresholdUpdate): Promise<Thresholds> {
    return updateThresholds(
      { thresholdsRepository: this.thresholdsRepository },
      update,
    );
  }
}
