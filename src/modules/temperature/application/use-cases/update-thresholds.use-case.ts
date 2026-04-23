import { Inject, Injectable } from '@nestjs/common';
import { Logger as AppLogger } from '@shared/common/logger/logger.service';
import { ValidationException } from '@shared/common/error-handling/domain/exceptions/validation.exception';
import { SensorThresholds } from '../../domain/sensor-thresholds';
import { ThresholdsRepositoryPort, THRESHOLDS_REPOSITORY } from '../ports/thresholds.repository.port';

@Injectable()
export class UpdateThresholdsUseCase {
  public constructor(
    @Inject(THRESHOLDS_REPOSITORY)
    private readonly thresholdsRepository: ThresholdsRepositoryPort,
    private readonly logger: AppLogger
  ) { }

  public async execute(next: SensorThresholds): Promise<SensorThresholds> {
    this.assertValid(next);
    await this.thresholdsRepository.update(next);
    return this.thresholdsRepository.get();
  }

  private assertValid(thresholds: SensorThresholds): void {
    if (thresholds.coldBelowCelsius >= thresholds.hotFromCelsius) {
      this.logger.warn(
        'Threshold validation failed: coldBelowCelsius must be strictly less than hotFromCelsius',
        {
          coldBelowCelsius: thresholds.coldBelowCelsius,
          hotFromCelsius: thresholds.hotFromCelsius,
        }
      );
      throw new ValidationException(
        '`coldBelowCelsius` must be strictly less than `hotFromCelsius`.'
      );
    }
  }
}
