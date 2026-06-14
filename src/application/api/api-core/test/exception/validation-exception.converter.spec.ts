import { ValidationExceptionConverter } from '../../src/error.converter/validation-exception.converter';
import { ValidationException } from '../../../../../domain/domain-contract/exceptions/validation.exception';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('ValidationExceptionConverter', () => {
  let converter: ValidationExceptionConverter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    converter = new ValidationExceptionConverter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => ({ url: '/api/v1/thresholds' }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('catch_shouldReturn400WithCorrectBody', () => {
    const exception = new ValidationException('coldMax must be less than hotMin');

    converter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      code: 'ValidationException',
      message: 'coldMax must be less than hotMin',
      path: '/api/v1/thresholds',
    }));
  });

  it('catch_shouldIncludeTimestamp', () => {
    converter.catch(new ValidationException('invalid'), mockHost);

    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    }));
  });
});
