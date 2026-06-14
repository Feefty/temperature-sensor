import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureCaptureEntity } from './src/persistence/entities/temperature-capture.entity';
import { ThresholdEntity } from './src/persistence/entities/threshold.entity';
import { TemperatureCaptureRepositoryAdapter } from './src/persistence/adapters/temperature-capture.repository.adapter';
import { ThresholdRepositoryAdapter } from './src/persistence/adapters/threshold.repository.adapter';
import { TEMPERATURE_CAPTURE_REPOSITORY, THRESHOLD_REPOSITORY } from '../shared/constants/injection-tokens';

@Module({
  imports: [TypeOrmModule.forFeature([TemperatureCaptureEntity, ThresholdEntity])],
  providers: [
    { provide: TEMPERATURE_CAPTURE_REPOSITORY, useClass: TemperatureCaptureRepositoryAdapter },
    { provide: THRESHOLD_REPOSITORY, useClass: ThresholdRepositoryAdapter },
  ],
  exports: [TEMPERATURE_CAPTURE_REPOSITORY, THRESHOLD_REPOSITORY],
})
export class InfrastructureModule {}
