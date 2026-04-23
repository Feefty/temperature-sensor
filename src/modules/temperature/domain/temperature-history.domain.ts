import { AutoMap } from 'automapper-classes';
import { SensorThresholds } from './sensor-thresholds';
import { TemperatureState } from './temperature-state.enum';

export class TemperatureHistory {
  @AutoMap()
  public celsius: number;

  @AutoMap()
  public state: TemperatureState;

  @AutoMap()
  public capturedAt: Date;

  @AutoMap()
  public snapshotColdBelow: number;

  @AutoMap()
  public snapshotHotFrom: number;

  public static record(celsius: number, state: TemperatureState, thresholds: SensorThresholds): TemperatureHistory {
    const history: TemperatureHistory = new TemperatureHistory();
    history.celsius = celsius;
    history.state = state;
    history.capturedAt = new Date();
    history.snapshotColdBelow = thresholds.coldBelowCelsius;
    history.snapshotHotFrom = thresholds.hotFromCelsius;
    return history;
  }
}
