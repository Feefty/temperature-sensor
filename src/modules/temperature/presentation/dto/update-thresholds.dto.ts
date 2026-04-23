import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateThresholdsDto {
  @ApiProperty({
    description: 'Upper bound (exclusive) of COLD — temperature histories below this are COLD.',
    example: 22,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  public coldBelowCelsius: number;

  @ApiProperty({
    description: 'Lower bound (inclusive) of HOT — temperature histories at or above this are HOT.',
    example: 35,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  public hotFromCelsius: number;
}
