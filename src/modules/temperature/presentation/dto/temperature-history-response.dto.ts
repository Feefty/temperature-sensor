import { AutoMap } from 'automapper-classes';
import { ApiProperty } from '@nestjs/swagger';
import { TemperatureState } from '../../domain/temperature-state.enum';

export class TemperatureHistoryResponseDto {
  @ApiProperty({ example: 23.4 })
  @AutoMap()
  public celsius: number;

  @ApiProperty({ enum: TemperatureState })
  @AutoMap()
  public state: TemperatureState;

  @ApiProperty({ type: String, format: 'date-time' })
  @AutoMap()
  public capturedAt: Date;

  @ApiProperty({ description: 'COLD threshold snapshot at capture time.' })
  @AutoMap()
  public snapshotColdBelow: number;

  @ApiProperty({ description: 'HOT threshold snapshot at capture time.' })
  @AutoMap()
  public snapshotHotFrom: number;
}
