import { Controller, Get, Post } from '@nestjs/common';

import { TemperatureReading } from '../../application/models/temperature-reading';
import { TemperatureHistory } from '../../application/use-cases/get-temperature-history.use-case';
import { TemperatureApplicationService } from '../../temperature-application.service';
import {
  TemperatureHistoryResponse,
  TemperatureResponse,
  toTemperatureResponse,
} from './dto/temperature-response.dto';

@Controller('temperature-requests')
export class TemperatureController {
  constructor(
    private readonly temperatureApplication: TemperatureApplicationService,
  ) {}

  @Post()
  async capture(): Promise<TemperatureResponse> {
    const reading: TemperatureReading =
      await this.temperatureApplication.captureCurrentTemperature();

    return toTemperatureResponse(reading);
  }

  @Get()
  async getHistory(): Promise<TemperatureHistoryResponse> {
    const history: TemperatureHistory =
      await this.temperatureApplication.getTemperatureHistory();

    return {
      items: history.items.map(toTemperatureResponse),
      count: history.count,
      maxSize: history.maxSize,
    };
  }
}
