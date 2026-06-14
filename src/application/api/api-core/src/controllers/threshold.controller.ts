import { Controller, Get, Put, Body, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetThresholdsQuery } from '../../../../../domain/domain-contract/command/query/threshold/get-thresholds.query';
import { UpdateThresholdsAction } from '../../../../../domain/domain-contract/command/action/threshold/update-thresholds.action';
import { Threshold } from '../../../../../domain/domain-contract/models/threshold.model';
import { toThresholdResponse } from '../mappers/threshold.mapper';
import { ZodValidationPipe } from '../openapi/validation/zod-validation.pipe';
import { zUpdateThresholdsRequest } from '../../../api-contract/generated/zod.gen';
import type { ThresholdsControllerMethods } from '../../../api-contract/generated/nestjs.gen';
import type { ThresholdsResponse, UpdateThresholdsRequest, UpdateThresholdsResponse } from '../../../api-contract/generated/types.gen';

@Controller('api/v1/thresholds')
export class ThresholdController implements ThresholdsControllerMethods {

  /*
     NestJs CQRS Mediator pattern already pre-defined in nestjs (not the same in java)
     No need to pass by primary ports interfaces, NestJs maps the domain use cases
     with the used Action/Query from IQuery/ICommand interfaces
  */

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async thresholds(): Promise<ThresholdsResponse> {
    const result: Threshold = await this.queryBus.execute(
      new GetThresholdsQuery()
    );
    return toThresholdResponse(result);
  }

  /*
      Mandatory validation, i used zod library so i don't create a custom
      UpdateThresholdsRequestValidator class that fails whenever the
      openapi UpdateThresholdsRequest object changes its contract
  */

  @Put()
  @UsePipes(new ZodValidationPipe(zUpdateThresholdsRequest))
  async updateThresholds(@Body() body: UpdateThresholdsRequest): Promise<UpdateThresholdsResponse> {
    const result: Threshold = await this.commandBus.execute(
      new UpdateThresholdsAction(body.coldMax, body.hotMin),
    );
    return toThresholdResponse(result);
  }
}
