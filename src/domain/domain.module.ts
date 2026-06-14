import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CaptureTemperatureUseCase } from './domain-core/src/usecase/sensor/capture-temperature.usecase';
import { UpdateThresholdsUseCase } from './domain-core/src/usecase/threshold/update-thresholds.usecase';
import { GetTemperatureHistoryUseCase } from './domain-core/src/usecase/sensor/get-temperature-history.usecase';
import { GetThresholdsUseCase } from './domain-core/src/usecase/threshold/get-thresholds.usecase';

const ActionUseCases = [CaptureTemperatureUseCase, UpdateThresholdsUseCase];
const QueryUseCases = [GetTemperatureHistoryUseCase, GetThresholdsUseCase];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...ActionUseCases, ...QueryUseCases],
  exports: [CqrsModule],
})
export class DomainModule {}
