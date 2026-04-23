import { AutoMap } from 'automapper-classes';

export class SensorThresholds {
  @AutoMap()
  public coldBelowCelsius: number;

  @AutoMap()
  public hotFromCelsius: number;
}
