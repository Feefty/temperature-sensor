import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateThresholdsAction } from '../../../../domain-contract/command/action/threshold/update-thresholds.action';
import { Threshold } from '../../../../domain-contract/models/threshold.model';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import { THRESHOLD_REPOSITORY } from '../../../../../shared/constants/injection-tokens';
import { validateThresholds } from '../../validation/threshold.validator';

@CommandHandler(UpdateThresholdsAction)
export class UpdateThresholdsUseCase implements ICommandHandler<UpdateThresholdsAction, Threshold> {
  constructor(
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(action: UpdateThresholdsAction): Promise<Threshold> {
    validateThresholds(action.coldMax, action.hotMin);
    return this.thresholdRepository.update(action.coldMax, action.hotMin);
  }
}
