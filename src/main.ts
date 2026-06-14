import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppModule } from './app.module';
import { DomainExceptionConverter } from './application/api/api-core/src/error.converter/domain-exception.converter';
import { ValidationExceptionConverter } from './application/api/api-core/src/error.converter/validation-exception.converter';
import { LoggingInterceptor } from './application/api/api-core/src/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new DomainExceptionConverter(), new ValidationExceptionConverter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Serve static OpenAPI spec (contract = source of truth)
  const specPath = path.resolve(__dirname, '..', 'src', 'api', 'api-contract', 'openapi.yaml');
  const spec = yaml.load(fs.readFileSync(specPath, 'utf8')) as Record<string, unknown>;
  SwaggerModule.setup('api-docs', app, spec as any);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger UI at http://localhost:${port}/api-docs`);
}

bootstrap();
