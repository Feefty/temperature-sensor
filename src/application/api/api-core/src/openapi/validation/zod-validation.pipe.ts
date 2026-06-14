import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

// Zod génère un schema de validation runtime de notre objet openapi
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    const messages = result.error.issues.map((issue) => {
      const field = issue.path.join('.');
      return field ? `${field}: ${issue.message}` : issue.message;
    });

    throw new BadRequestException({
      statusCode: 400,
      message: messages,
      error: 'Bad Request'
    });
  }
}
