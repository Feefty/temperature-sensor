import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { ApplicationExceptionFilter } from '@shared/common/error-handling/infrastructure/filters/application-exception.filter';
import { GlobalExceptionFilter } from '@shared/common/error-handling/infrastructure/filters/global-exception.filter';

export function initApp(app: INestApplication): void {
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: '*',
    // Match real routes only (`TemperatureController`: GET + PUT) plus OPTIONS for preflight.
    methods: ['GET', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new GlobalExceptionFilter(), new ApplicationExceptionFilter());

  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Temperature Sensor API')
    .setDescription('Hexagonal NestJS API - sensor history, HOT/WARM/COLD, history, thresholds.')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}
