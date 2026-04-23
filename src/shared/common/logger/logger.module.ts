import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Logger } from './logger.service';

@Module({
  imports: [ConfigModule],
  providers: [Logger, { provide: 'LoggerInterface', useClass: Logger }],
  exports: [Logger, 'LoggerInterface'],
})
export class LoggerModule {}
