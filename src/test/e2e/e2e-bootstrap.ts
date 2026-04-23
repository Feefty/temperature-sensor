import { INestApplication, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from '@shared/common/logger/logger.service';
import { DatabaseTestService } from '@shared/common/test/e2e/database-test.service';
import { TemperatureTestService } from '@shared/common/test/temperature-test.service';
import { TestAppModule } from '@shared/common/test/test-app.module';
import { ConfigServerModel } from '@shared/config/models/config-server.model';
import { DataSource, Repository } from 'typeorm';
import { initApp } from '../../app.initializer';
import { TemperatureHistoryEntity } from '../../modules/temperature/infrastructure/persistence/temperature-history.entity';
import { SensorThresholdsEntity } from '../../modules/temperature/infrastructure/persistence/temperature-threshold.entity';

export type TemperatureE2eContext = {
  app: INestApplication;
  dataSource: DataSource;
  testService: TemperatureTestService;
  databaseTestService: DatabaseTestService;
  moduleRef: TestingModule;
};

export async function createTemperatureE2eApplication(): Promise<TemperatureE2eContext> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [TestAppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useLogger(false);
  initApp(app);
  const config: ConfigService = moduleRef.get(ConfigService);
  const server: ConfigServerModel = config.getOrThrow<ConfigServerModel>('server');
  app.setGlobalPrefix(server.globalPrefix, {
    exclude: [
      { path: 'docs', method: RequestMethod.ALL },
      { path: 'docs-json', method: RequestMethod.ALL },
    ],
  });
  await app.init();

  const dataSource: DataSource = moduleRef.get(DataSource);
  const historyRepo: Repository<TemperatureHistoryEntity> = moduleRef.get(
    getRepositoryToken(TemperatureHistoryEntity)
  );
  const thresholdRepo: Repository<SensorThresholdsEntity> = moduleRef.get(
    getRepositoryToken(SensorThresholdsEntity)
  );
  const logger: Logger = moduleRef.get(Logger);
  const testService: TemperatureTestService = new TemperatureTestService(
    historyRepo,
    thresholdRepo,
    logger,
    config
  );
  const databaseTestService: DatabaseTestService = new DatabaseTestService(dataSource);
  return { app, dataSource, testService, databaseTestService, moduleRef };
}
