import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validateSync, ValidationError } from 'class-validator';

export function validate<T extends object>(
  cls: ClassConstructor<T>,
  config: Record<string, unknown>
): T {
  const finalConfig: T = plainToClass(cls, config, { enableImplicitConversion: true });
  const errors: ValidationError[] = validateSync(finalConfig, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return finalConfig;
}
