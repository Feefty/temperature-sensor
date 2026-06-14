import { Module } from '@nestjs/common';
import { DomainModule } from '../../domain/domain.module';
import { SensorController } from './api-core/src/controllers/sensor.controller';
import { ThresholdController } from './api-core/src/controllers/threshold.controller';

@Module({
  imports: [DomainModule],
  controllers: [SensorController, ThresholdController],
})
export class ApiCoreModule {}
