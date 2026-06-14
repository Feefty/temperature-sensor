import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiCoreModule } from './application/api/api-core/src/api-core.module';
import appConfig from './infrastructure/src/configuration/app.config';
import databaseConfig from './infrastructure/src/configuration/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: process.env.NODE_ENV === 'test' ? 'config/.env.test' : 'config/.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        database: config.get('database.name'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ApiCoreModule,
  ],
})
export class AppModule {}
