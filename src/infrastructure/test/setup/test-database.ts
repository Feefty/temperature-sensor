import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';
import { TemperatureCaptureEntity } from '../../src/persistence/entities/temperature-capture.entity';
import { ThresholdEntity } from '../../src/persistence/entities/threshold.entity';
import * as fs from 'fs';
import * as path from 'path';

let container: StartedTestContainer;
let dataSource: DataSource;

export async function startTestDatabase(): Promise<DataSource> {
  container = await new GenericContainer('postgres:16-alpine')
    .withEnvironment({
      POSTGRES_DB: 'temperature_sensor_test',
      POSTGRES_USER: 'admin',
      POSTGRES_PASSWORD: 'password',
    })
    .withExposedPorts(5432)
    // waiting the postgres to be up before running the tests
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections', 2))
    .start();

  dataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getMappedPort(5432),
    database: 'temperature_sensor_test',
    username: 'admin',
    password: 'password',
    entities: [TemperatureCaptureEntity, ThresholdEntity],
    synchronize: false,
  });

  await dataSource.initialize();

  // Run migrations
  const migrationSql = fs.readFileSync(
    path.resolve(__dirname, '../../src/resources/db/migrations/001_initial_schema.sql'),
    'utf8',
  );
  await dataSource.query(migrationSql);

  // Run seeds
  const seedSql = fs.readFileSync(
    path.resolve(__dirname, '../../src/resources/db/seeds/001_default_thresholds.sql'),
    'utf8',
  );
  await dataSource.query(seedSql);

  return dataSource;
}

export async function stopTestDatabase(): Promise<void> {
  if (dataSource?.isInitialized) await dataSource.destroy();
  if (container) await container.stop();
}

export function getDataSource(): DataSource {
  return dataSource;
}
