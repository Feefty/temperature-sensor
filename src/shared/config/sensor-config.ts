import { ConfigSensorModel } from './models/config-sensor.model';

export function sensorConfig(): ConfigSensorModel {
  return {
    thresholdSingletonKey: +process.env.SENSOR_THRESHOLD_SINGLETON_KEY!,
    historySize: +process.env.SENSOR_HISTORY_SIZE!,
    simulatedMinCelsius: +process.env.SENSOR_SIMULATED_MIN_CELSIUS!,
    simulatedMaxCelsius: +process.env.SENSOR_SIMULATED_MAX_CELSIUS!,
  };
}
