import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from './application-error.interface';

export class BaseErrors {
  public static NOT_FOUND(entityName: string, id: string): ApplicationError {
    return {
      code: `${entityName.toUpperCase()}_NOT_FOUND`,
      status: HttpStatus.NOT_FOUND,
      message: `${entityName} not found.`,
      metadata: id,
    };
  }

  public static VALIDATION_ERROR(message: string): ApplicationError {
    return {
      code: 'VALIDATION_ERROR',
      status: HttpStatus.BAD_REQUEST,
      message,
    };
  }

  public static OPERATION_NOT_ALLOWED(reason: string): ApplicationError {
    return {
      code: 'OPERATION_NOT_ALLOWED',
      status: HttpStatus.FORBIDDEN,
      message: reason,
    };
  }
}
