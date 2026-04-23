import { INestApplication, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@shared/common/logger';
import { ConfigServerModel } from '@shared/config/models/config-server.model';
import 'reflect-metadata';
import { initApp } from './app.initializer';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  initApp(app);
  const config: ConfigService = app.get(ConfigService);
  const server: ConfigServerModel = config.getOrThrow<ConfigServerModel>('server');
  app.setGlobalPrefix(server.globalPrefix, {
    exclude: [
      { path: 'docs', method: RequestMethod.ALL },
      { path: 'docs-json', method: RequestMethod.ALL },
    ],
  });
  await app.listen(server.port, server.hostname);
  const logger: Logger = app.get(Logger);
  logger.log(`Listening on http://${server.hostname}:${server.port}/${server.globalPrefix}`);
  logger.log(`Swagger at http://${server.hostname}:${server.port}/docs`);
}

bootstrap().catch((err: unknown) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
