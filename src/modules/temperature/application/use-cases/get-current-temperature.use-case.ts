import { SensorThresholds } from '@modules/temperature/domain/sensor-thresholds';
import { Inject, Injectable } from '@nestjs/common';
import { CurrentTemperatureResult } from '../../domain/current-temperature-result';
import { classifyTemperature } from '../../domain/temperature-classifier';
import { TemperatureHistory } from '../../domain/temperature-history.domain';
import { TemperatureState } from '../../domain/temperature-state.enum';
import {
  TEMPERATURE_HISTORY_REPOSITORY,
  TemperatureHistoryRepositoryPort,
} from '../ports/temperature-history.repository.port';
import { TEMPERATURE_SENSOR, TemperatureSensorPort } from '../ports/temperature-sensor.port';
import { THRESHOLDS_REPOSITORY, ThresholdsRepositoryPort } from '../ports/thresholds.repository.port';

@Injectable()
export class GetCurrentTemperatureUseCase {
  public constructor(
    @Inject(TEMPERATURE_SENSOR)
    private readonly sensorPort: TemperatureSensorPort,
    @Inject(THRESHOLDS_REPOSITORY)
    private readonly thresholdsRepository: ThresholdsRepositoryPort,
    @Inject(TEMPERATURE_HISTORY_REPOSITORY)
    private readonly temperatureHistoriesRepository: TemperatureHistoryRepositoryPort
  ) { }

  public async execute(): Promise<CurrentTemperatureResult> {
    const celsius: number = await this.sensorPort.readCelsius();
    const sensorThresholds: SensorThresholds = await this.thresholdsRepository.get();

    const state: TemperatureState = classifyTemperature(celsius, sensorThresholds);
    const temperatureHistory: TemperatureHistory = TemperatureHistory.record(celsius, state, sensorThresholds);
    await this.temperatureHistoriesRepository.save(temperatureHistory);

    const result: CurrentTemperatureResult = CurrentTemperatureResult.fromReading(
      celsius,
      state,
      temperatureHistory.capturedAt
    );
    return result;
  }
}
