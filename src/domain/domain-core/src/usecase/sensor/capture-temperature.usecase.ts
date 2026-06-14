import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CaptureTemperatureAction } from '../../../../domain-contract/command/action/sensor/capture-temperature.action';
import { TemperatureCapture } from '../../../../domain-contract/models/temperature-capture.model';
import { TemperatureState } from '../../../../domain-contract/models/temperature-state.enum';
import { TemperatureCaptureRepositoryPort } from '../../../../domain-contract/ports/secondary/temperature-capture.repository.port';
import { ThresholdRepositoryPort } from '../../../../domain-contract/ports/secondary/threshold.repository.port';
import {
  TEMPERATURE_CAPTURE_REPOSITORY,
  THRESHOLD_REPOSITORY,
} from '../../../../../shared/dinjection/tokens/injection-tokens';
import { v4 as uuidv4 } from 'uuid';
import { DomainException } from '../../../../domain-contract/exceptions/domain.exception';

@CommandHandler(CaptureTemperatureAction)
export class CaptureTemperatureUseCase
  implements ICommandHandler<CaptureTemperatureAction, TemperatureCapture>
{
  constructor(
    @Inject(TEMPERATURE_CAPTURE_REPOSITORY)
    private readonly captureRepository: TemperatureCaptureRepositoryPort,
    @Inject(THRESHOLD_REPOSITORY)
    private readonly thresholdRepository: ThresholdRepositoryPort,
  ) {}

  async execute(): Promise<TemperatureCapture> {
    const value = Math.round((Math.random() * 60 - 10) * 100) / 100;
    const state = await this.getTemperatureState(value);

    const capture: TemperatureCapture = {
      id: uuidv4(),
      value,
      state,
      capturedAt: new Date(),
    };
    await this.captureRepository.save(capture);
    return capture;
  }

  private async getTemperatureState(value: number): Promise<TemperatureState> {
    const threshold = await this.thresholdRepository.getCurrent();
    if (!threshold) throw new DomainException('No threshold configuration found');

    if (value >= threshold.hotMin) return TemperatureState.HOT;
    if (value < threshold.coldMax) return TemperatureState.COLD;
    return TemperatureState.WARM;
  }
}
