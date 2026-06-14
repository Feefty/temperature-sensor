import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetThresholdsQuery } from '../../../../domain-contract/command/query/threshold/get-thresholds.query';
import { Threshold } from '../../../../domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { THRESHOLD_REPOSITORY } from '../../../../../shared/constants/injection-tokens';

@QueryHandler(GetThresholdsQuery)
export class GetThresholdsUseCase implements IQueryHandler<GetThresholdsQuery, Threshold> {
  constructor(
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(): Promise<Threshold> {
    return this.thresholdRepository.getCurrent();
  }
}
