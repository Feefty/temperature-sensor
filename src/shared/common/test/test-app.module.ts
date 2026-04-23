import { classes } from 'automapper-classes';
import { AutomapperModule } from 'automapper-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration, getEnvFilePaths } from '@shared/config/configuration';
import { OrmDatabaseConfig } from '@shared/config/orm-config';
import { LoggerModule } from '@shared/common/logger/logger.module';
import { TemperatureModule } from '../../../modules/temperature/temperature.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: getEnvFilePaths(),
    }),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      useClass: OrmDatabaseConfig,
    }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    TemperatureModule,
  ],
})
export class TestAppModule {}
