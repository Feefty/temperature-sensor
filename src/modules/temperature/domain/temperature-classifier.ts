import { SensorThresholds } from './sensor-thresholds';
import { TemperatureState } from './temperature-state.enum';

export function classifyTemperature(celsius: number, sensorThresholds: SensorThresholds): TemperatureState {
  const { coldBelowCelsius, hotFromCelsius } = sensorThresholds;

  if (celsius < coldBelowCelsius) {
    return TemperatureState.COLD;
  }
  if (celsius >= hotFromCelsius) {
    return TemperatureState.HOT;
  }
  return TemperatureState.WARM;
}
