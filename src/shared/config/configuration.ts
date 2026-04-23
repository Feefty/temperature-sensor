import * as dotenv from 'dotenv';
import { join } from 'node:path';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TemperatureHistoryEntity } from '../../modules/temperature/infrastructure/persistence/temperature-history.entity';
import { SensorThresholdsEntity } from '../../modules/temperature/infrastructure/persistence/temperature-threshold.entity';
import { ConfigModel } from './models/config.model';
import { validate } from './configuration-validator';
import { readDatabaseSettingsFromEnv } from './database-config';
import { serverConfig } from './server-config';
import { sensorConfig } from './sensor-config';

export function configuration(): ConfigModel {
  const config: ConfigModel = {
    server: serverConfig(),
    database: readDatabaseSettingsFromEnv(),
    sensor: sensorConfig(),
  };
  return validate(ConfigModel, config as unknown as Record<string, unknown>);
}

export function getEntities(): EntityClassOrSchema[] {
  return [TemperatureHistoryEntity, SensorThresholdsEntity];
}

export function getMigrations(): string[] {
  const root: string = join(__dirname, '..', '..', 'migrations');
  return [join(root, '*.ts'), join(root, '*.js')];
}

export function getEnvFilePaths(): string[] {
  const nodeEnv: string = process.env.NODE_ENV?.trim() || 'docker';
  const envFileSlug: string =
    nodeEnv === 'development' || nodeEnv === 'docker' ? 'docker' : nodeEnv;
  const envLocal: string = `.env.${envFileSlug}`;
  return [`./${envLocal}`, './.env'];
}

export function getEnvFilePath(): string[] {
  return getEnvFilePaths();
}

export function loadTemperatureSensorEnvFromDisk(): void {
  const paths: string[] = getEnvFilePaths();
  if (paths.length < 2) {
    dotenv.config({ path: paths[0] });
    return;
  }
  const winsOnDuplicate: string = paths[0];
  const base: string = paths[1];
  dotenv.config({ path: base });
  dotenv.config({ path: winsOnDuplicate, override: true });
}
