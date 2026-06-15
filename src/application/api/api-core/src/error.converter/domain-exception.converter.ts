import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainException } from '../../../../../domain/domain-contract/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionConverter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionConverter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    this.logger.warn(`Domain exception: ${exception.message}`);

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: exception.name,
      // We should not return the message directly to the user
      // But iam doing it just to make things simpler without adding other exceptions
      // TODO: Add more specific domain exceptions and don't leak data to the client
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
