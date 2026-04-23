import { SensorThresholds } from '../sensor-thresholds';
import { classifyTemperature } from '../temperature-classifier';
import { TemperatureState } from '../temperature-state.enum';

function createSensorThresholds(coldBelowCelsius: number, hotFromCelsius: number): SensorThresholds {
  const sensorThresholds: SensorThresholds = new SensorThresholds();
  sensorThresholds.coldBelowCelsius = coldBelowCelsius;
  sensorThresholds.hotFromCelsius = hotFromCelsius;
  return sensorThresholds;
}

describe('classifyTemperature', (): void => {
  it('marks below cold boundary as COLD', (): void => {
    expect(classifyTemperature(21.9, createSensorThresholds(22, 35))).toBe(TemperatureState.COLD);
  });

  it('marks at or above hot boundary as HOT', (): void => {
    expect(classifyTemperature(35, createSensorThresholds(22, 35))).toBe(TemperatureState.HOT);
    expect(classifyTemperature(40, createSensorThresholds(22, 35))).toBe(TemperatureState.HOT);
  });

  it('marks the warm band between boundaries', (): void => {
    expect(classifyTemperature(22, createSensorThresholds(22, 35))).toBe(TemperatureState.WARM);
    expect(classifyTemperature(34.99, createSensorThresholds(22, 35))).toBe(TemperatureState.WARM);
  });
});
