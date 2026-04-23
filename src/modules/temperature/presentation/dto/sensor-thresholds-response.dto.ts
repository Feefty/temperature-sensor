import { AutoMap } from 'automapper-classes';
import { ApiProperty } from '@nestjs/swagger';

export class SensorThresholdsResponseDto {
  @ApiProperty({ example: 22 })
  @AutoMap()
  public coldBelowCelsius: number;

  @ApiProperty({ example: 35 })
  @AutoMap()
  public hotFromCelsius: number;
}
