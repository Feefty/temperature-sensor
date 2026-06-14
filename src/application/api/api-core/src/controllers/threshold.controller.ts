import { Controller, Get, Put, Body, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetThresholdsQuery } from '../../../../../domain/domain-contract/command/query/threshold/get-thresholds.query';
import { UpdateThresholdsAction } from '../../../../../domain/domain-contract/command/action/threshold/update-thresholds.action';
import { Threshold } from '../../../../../domain/domain-contract/models/threshold.model';
import { toThresholdResponse } from '../mappers/threshold.mapper';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { zUpdateThresholdsRequest } from '../../../api-contract/generated/zod.gen';
import type { ThresholdsControllerMethods } from '../../../api-contract/generated/nestjs.gen';
import type { ThresholdsResponse, UpdateThresholdsRequest, UpdateThresholdsResponse } from '../../../api-contract/generated/types.gen';

@Controller('api/v1/thresholds')
export class ThresholdController implements ThresholdsControllerMethods {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async thresholds(): Promise<ThresholdsResponse> {
    const result: Threshold = await this.queryBus.execute(new GetThresholdsQuery());
    return toThresholdResponse(result);
  }

  @Put()
  @UsePipes(new ZodValidationPipe(zUpdateThresholdsRequest))
  async updateThresholds(@Body() body: UpdateThresholdsRequest): Promise<UpdateThresholdsResponse> {
    const result: Threshold = await this.commandBus.execute(
      new UpdateThresholdsAction(body.coldMax, body.hotMin),
    );
    return toThresholdResponse(result);
  }
}
