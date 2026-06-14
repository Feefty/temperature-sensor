import { DomainExceptionConverter } from '../../src/error.converter/domain-exception.converter';
import { DomainException } from '../../../../../domain/domain-contract/exceptions/domain.exception';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('DomainExceptionConverter', () => {
  let converter: DomainExceptionConverter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    converter = new DomainExceptionConverter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => ({ url: '/api/v1/test' }),
      }),
    } as unknown as ArgumentsHost;
  });

  //region Conversion scenarios
  it('catch_shouldReturnStatus422_whenDomainExceptionIsThrown', () => {
    converter.catch(new DomainException('Something went wrong'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 422,
      code: 'DomainException',
      message: 'Something went wrong',
      path: '/api/v1/test',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    }));
  });
  //endregion
});
