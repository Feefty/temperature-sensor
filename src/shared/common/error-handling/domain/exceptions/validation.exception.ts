import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class ValidationException extends ApplicationException {
  public constructor(message: string) {
    super({ code: 'VALIDATION_ERROR', status: HttpStatus.BAD_REQUEST, message });
  }
}
