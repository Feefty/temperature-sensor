import { IsNumber, ValidateIf } from 'class-validator';

function isProvided(_object: object, value: unknown): boolean {
  return value !== undefined;
}

export class UpdateThresholdsDto {
  @ValidateIf(isProvided)
  @IsNumber()
  coldThreshold?: number;

  @ValidateIf(isProvided)
  @IsNumber()
  hotThreshold?: number;
}
