import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTemperatureHistoryQuery } from '../../../../domain-contract/command/query/sensor/get-temperature-history.query';
import { TemperatureCapture } from '../../../../domain-contract/models/temperature-capture.model';
import { TemperatureCaptureRepositoryPort } from '../../../../domain-contract/ports/secondary/temperature-capture.repository.port';
import { TEMPERATURE_CAPTURE_REPOSITORY } from '../../../../../shared/dinjection/tokens/injection-tokens';

const MAX_HISTORY_SIZE = 15;

@QueryHandler(GetTemperatureHistoryQuery)
export class GetTemperatureHistoryUseCase
  implements IQueryHandler<GetTemperatureHistoryQuery, TemperatureCapture[]>
{
  constructor(
    @Inject(TEMPERATURE_CAPTURE_REPOSITORY)
    private readonly captureRepository: TemperatureCaptureRepositoryPort,
  ) {}

  async execute(): Promise<TemperatureCapture[]> {
    return this.captureRepository.findLastN(MAX_HISTORY_SIZE);
  }
}
