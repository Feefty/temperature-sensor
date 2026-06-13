import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { EmptyThresholdUpdateError } from '../../application/use-cases/update-thresholds.use-case';
import {
  InvalidThresholdRangeError,
  InvalidThresholdValueError,
} from '../../domain/thresholds';

type ThresholdValidationError =
  | EmptyThresholdUpdateError
  | InvalidThresholdRangeError
  | InvalidThresholdValueError;

type ErrorResponseBody = Readonly<{
  statusCode: HttpStatus.BAD_REQUEST;
  message: string;
  error: 'Bad Request';
}>;

interface HttpResponse {
  status(statusCode: number): HttpResponse;
  json(body: ErrorResponseBody): void;
}

@Catch(
  EmptyThresholdUpdateError,
  InvalidThresholdRangeError,
  InvalidThresholdValueError,
)
export class ThresholdValidationExceptionFilter
  implements ExceptionFilter<ThresholdValidationError>
{
  catch(exception: ThresholdValidationError, host: ArgumentsHost): void {
    const response: HttpResponse =
      host.switchToHttp().getResponse<HttpResponse>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
