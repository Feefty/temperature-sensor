import { Body, Controller, Get, Patch } from '@nestjs/common';

import { TemperatureApplicationService } from '../../temperature-application.service';
import { ThresholdsResponse } from './dto/thresholds-response.dto';
import { UpdateThresholdsDto } from './dto/update-thresholds.dto';

@Controller('thresholds')
export class ThresholdsController {
  constructor(
    private readonly temperatureApplication: TemperatureApplicationService,
  ) {}

  @Get()
  async get(): Promise<ThresholdsResponse> {
    return this.temperatureApplication.getThresholds();
  }

  @Patch()
  async update(
    @Body() update: UpdateThresholdsDto,
  ): Promise<ThresholdsResponse> {
    return this.temperatureApplication.updateThresholds(update);
  }
}
