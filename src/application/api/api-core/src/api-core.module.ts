import { Module } from '@nestjs/common';
import { DomainModule } from '../../../../domain/domain-core/src/domain.module';
import { SensorController } from './controllers/sensor.controller';
import { ThresholdController } from './controllers/threshold.controller';

@Module({
  imports: [DomainModule],
  controllers: [SensorController, ThresholdController],
})
export class ApiCoreModule {}
