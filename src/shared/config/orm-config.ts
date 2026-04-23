import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Logger } from '@shared/common/logger/logger.service';
import { getEntities, getMigrations } from './configuration';
import { databaseConfig } from './database-config';

@Injectable()
export class OrmDatabaseConfig implements TypeOrmOptionsFactory {
  public constructor(private readonly logger: Logger) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...databaseConfig(getEntities, getMigrations),
      logger: this.logger,
    };
  }
}
