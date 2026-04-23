import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { ApplicationException } from '../../domain/exceptions/application.exception';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  public catch(exception: ApplicationException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const { applicationError } = exception;

    response.status(applicationError.status).json({
      code: applicationError.code,
      message: applicationError.message,
      status: applicationError.status,
      metadata: applicationError.metadata,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
