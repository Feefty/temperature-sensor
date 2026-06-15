import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetThresholdsQuery } from '../../../../domain-contract/command/query/threshold/get-thresholds.query';
import { Threshold } from '../../../../domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { THRESHOLD_REPOSITORY } from '../../../../../shared/dinjection/tokens/injection-tokens';
import { DomainException } from '../../../../domain-contract/exceptions/domain.exception';

@QueryHandler(GetThresholdsQuery)
export class GetThresholdsUseCase implements IQueryHandler<GetThresholdsQuery, Threshold> {
  constructor(
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(): Promise<Threshold> {
    const threshold = await this.thresholdRepository.getCurrent();
    if (!threshold) throw new DomainException('No threshold configuration found');

    return threshold;
  }
}
