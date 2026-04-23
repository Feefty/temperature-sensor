import { AutoMap } from 'automapper-classes';
import { TemperatureState } from './temperature-state.enum';

export class CurrentTemperatureResult {
  @AutoMap()
  public celsius: number;

  @AutoMap()
  public state: TemperatureState;

  @AutoMap()
  public capturedAt: Date;

  public static fromReading(celsius: number, state: TemperatureState, capturedAt: Date = new Date()): CurrentTemperatureResult {
    const result: CurrentTemperatureResult = new CurrentTemperatureResult();
    result.celsius = celsius;
    result.state = state;
    result.capturedAt = capturedAt;
    return result;
  }
}
