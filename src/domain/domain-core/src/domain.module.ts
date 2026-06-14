import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from '../../../infrastructure/src/infrastructure.module';
import { CaptureTemperatureUseCase } from './usecase/sensor/capture-temperature.usecase';
import { UpdateThresholdsUseCase } from './usecase/threshold/update-thresholds.usecase';
import { GetTemperatureHistoryUseCase } from './usecase/sensor/get-temperature-history.usecase';
import { GetThresholdsUseCase } from './usecase/threshold/get-thresholds.usecase';

const ActionUseCases = [CaptureTemperatureUseCase, UpdateThresholdsUseCase];
const QueryUseCases = [GetTemperatureHistoryUseCase, GetThresholdsUseCase];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...ActionUseCases, ...QueryUseCases],
  exports: [CqrsModule],
})
export class DomainModule {}
