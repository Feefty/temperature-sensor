import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TemperatureSensorPort } from '../../application/ports/temperature-sensor.port';
import { ConfigSensorModel } from '@shared/config/models/config-sensor.model';

/**
 * In-memory `TemperatureSensor` replacement — returns °C without hardware.
 * Swap with a driver adapter when a real probe is available.
 */
@Injectable()
export class SimulatedTemperatureSensorAdapter implements TemperatureSensorPort {
  private readonly minCelsius: number;
  private readonly maxCelsius: number;

  public constructor(config: ConfigService) {
    const sensorConfig: ConfigSensorModel = config.getOrThrow<ConfigSensorModel>('sensor');
    this.minCelsius = sensorConfig.simulatedMinCelsius!;
    this.maxCelsius = sensorConfig.simulatedMaxCelsius!;
  }

  public async readCelsius(): Promise<number> {
    const span: number = Math.max(0, this.maxCelsius - this.minCelsius);
    const celsius: number = this.minCelsius + Math.random() * span;
    return Math.round(celsius * 100) / 100;
  }
}
