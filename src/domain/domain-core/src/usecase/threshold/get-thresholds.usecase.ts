import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetThresholdsQuery } from '../../../../domain-contract/command/query/threshold/get-thresholds.query';
import { Threshold } from '../../../../domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { THRESHOLD_REPOSITORY } from '../../../../../shared/dinjection/tokens/injection-tokens';

@QueryHandler(GetThresholdsQuery)
export class GetThresholdsUseCase implements IQueryHandler<GetThresholdsQuery, Threshold | null> {
  constructor(
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(): Promise<Threshold | null> {
    return this.thresholdRepository.getCurrent();
  }
}
