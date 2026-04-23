import { IsDefined, IsNumber } from 'class-validator';

export class ConfigSensorModel {
  @IsDefined()
  @IsNumber()
  public thresholdSingletonKey: number;

  @IsDefined()
  @IsNumber()
  public historySize: number;

  @IsDefined()
  @IsNumber()
  public simulatedMinCelsius: number;

  @IsDefined()
  @IsNumber()
  public simulatedMaxCelsius: number;
}
