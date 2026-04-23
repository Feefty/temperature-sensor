import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class EntityNotFoundException extends ApplicationException {
  public constructor(entityName: string, id: string) {
    super({
      code: `${entityName.toUpperCase()}_NOT_FOUND`,
      status: HttpStatus.NOT_FOUND,
      message: `${entityName} not found.`,
      metadata: id,
    });
  }
}
