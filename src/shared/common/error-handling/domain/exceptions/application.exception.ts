import { HttpException } from '@nestjs/common';
import { ApplicationError } from '../errors/application-error.interface';

export class ApplicationException extends HttpException {
  public readonly applicationError: ApplicationError;

  public constructor(applicationError: ApplicationError) {
    super(applicationError.message, applicationError.status);
    this.applicationError = applicationError;
  }
}
