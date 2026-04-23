import { ConfigFactoryKeyHost, ConfigModule, registerAs } from '@nestjs/config';
import { DataSource } from 'typeorm';
import {
  configuration,
  getEntities,
  getEnvFilePath,
  getMigrations,
  loadTemperatureSensorEnvFromDisk,
} from './configuration';
import { databaseConfig } from './database-config';

loadTemperatureSensorEnvFromDisk();

const connectionDataSource: (() => DataSource) & ConfigFactoryKeyHost<DataSource> = registerAs('database', () => {
  return new DataSource(databaseConfig(getEntities, getMigrations));
});

ConfigModule.forRoot({
  envFilePath: getEnvFilePath(),
  load: [configuration],
});
export default connectionDataSource();
