import { ApplicationError } from '@shared/common/error-handling/domain/errors/application-error.interface';
import { BaseErrors } from '@shared/common/error-handling/domain/errors/base.errors';

export class TemperatureErrors {
  public static THRESHOLDS_NOT_FOUND(id: string): ApplicationError {
    return BaseErrors.NOT_FOUND('SensorThresholds', id);
  }

  public static VALIDATION_ERROR(message: string): ApplicationError {
    return BaseErrors.VALIDATION_ERROR(message);
  }
}
