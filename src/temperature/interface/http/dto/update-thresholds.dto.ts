import { IsNumber, IsOptional } from 'class-validator';

export class UpdateThresholdsDto {
  @IsOptional()
  @IsNumber()
  coldThreshold?: number;

  @IsOptional()
  @IsNumber()
  hotThreshold?: number;
}
