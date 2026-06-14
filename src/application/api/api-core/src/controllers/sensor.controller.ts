import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CaptureTemperatureAction } from '../../../../../domain/domain-contract/command/action/sensor/capture-temperature.action';
import { GetTemperatureHistoryQuery } from '../../../../../domain/domain-contract/command/query/sensor/get-temperature-history.query';
import { TemperatureCapture } from '../../../../../domain/domain-contract/models/temperature-capture.model';
import { toTemperatureCaptureResponse, toTemperatureCaptureResponseList } from '../mappers/temperature-capture.mapper';
import type { SensorsControllerMethods } from '../../../api-contract/generated/nestjs.gen';
import type { CaptureTemperatureResponse, TemperatureHistoryResponse } from '../../../api-contract/generated/types.gen';

@Controller('api/v1/sensors')
export class SensorController implements SensorsControllerMethods {
  constructor(
    // Mediator pattern already pre-defined in nestjs (not the same in java)
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('capture')
  async captureTemperature(): Promise<CaptureTemperatureResponse> {
    const result: TemperatureCapture = await this.commandBus.execute(new CaptureTemperatureAction());
    return toTemperatureCaptureResponse(result);
  }

  @Get('history')
  async temperatureHistory(): Promise<TemperatureHistoryResponse> {
    const result: TemperatureCapture[] = await this.queryBus.execute(new GetTemperatureHistoryQuery());
    return toTemperatureCaptureResponseList(result);
  }
}
