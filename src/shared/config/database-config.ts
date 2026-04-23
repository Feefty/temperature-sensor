import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSourceOptions } from 'typeorm';
import { ConfigDatabaseModel } from './models/config-database.model';
import { TYPEORM_MIGRATIONS_TABLE_NAME } from './typeorm-migrations.shared';

export function readDatabaseSettingsFromEnv(): ConfigDatabaseModel {
  return {
    host: process.env.DATABASE_HOST!,
    port: Number.parseInt(process.env.DATABASE_PORT ?? '3306', 10) || 3306,
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    migrationsRun: process.env.DATABASE_MIGRATION_RUN === 'true',
  };
}

export function databaseConfig(
  getEntities: () => EntityClassOrSchema[],
  getMigrations: () => string[]
): DataSourceOptions {
  const database: ConfigDatabaseModel = readDatabaseSettingsFromEnv();
  return {
    type: 'mysql',
    ...database,
    entities: getEntities(),
    migrations: getMigrations(),
    migrationsTableName: TYPEORM_MIGRATIONS_TABLE_NAME,
    charset: 'utf8mb4',
    cache: true,
    extra: {
      timezone: process.env.DATABASE_TIMEZONE,
      waitForConnections: process.env.DATABASE_WAIT_TIME_FOR_CONNECTIONS === 'true',
      connectionLimit: +(process.env.DATABASE_CONNECTION_LIMIT!),
      connectTimeout: +(process.env.DATABASE_CONNECT_TIMEOUT!),
    },
  };
}
