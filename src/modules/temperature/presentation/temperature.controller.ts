import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentTemperatureUseCase } from '../application/use-cases/get-current-temperature.use-case';
import { CurrentTemperatureResult } from '../domain/current-temperature-result';
import { GetTemperatureHistoryUseCase } from '../application/use-cases/get-temperature-history.use-case';
import { GetThresholdsUseCase } from '../application/use-cases/get-thresholds.use-case';
import { UpdateThresholdsUseCase } from '../application/use-cases/update-thresholds.use-case';
import { TemperatureHistory } from '../domain/temperature-history.domain';
import { SensorThresholds } from '../domain/sensor-thresholds';
import { TemperatureDtoMapper } from './mappers/temperature-dto.mapper';
import { CurrentTemperatureResponseDto } from './dto/current-temperature-response.dto';
import { TemperatureHistoryResponseDto } from './dto/temperature-history-response.dto';
import { SensorThresholdsResponseDto } from './dto/sensor-thresholds-response.dto';
import { UpdateThresholdsDto } from './dto/update-thresholds.dto';

@ApiTags('temperature')
@Controller('temperature')
export class TemperatureController {
  public constructor(
    private readonly getCurrentTemperature: GetCurrentTemperatureUseCase,
    private readonly getTemperatureHistory: GetTemperatureHistoryUseCase,
    private readonly getThresholds: GetThresholdsUseCase,
    private readonly updateThresholds: UpdateThresholdsUseCase,
    private readonly dtoMapper: TemperatureDtoMapper
  ) { }

  @Get('current')
  @ApiOperation({ summary: 'Read the sensor (°C), derive HOT/WARM/COLD, persist one history row.' })
  @ApiOkResponse({ type: CurrentTemperatureResponseDto })
  public async getCurrent(): Promise<CurrentTemperatureResponseDto> {
    const result: CurrentTemperatureResult = await this.getCurrentTemperature.execute();
    return this.dtoMapper.currentResultToDto(result);
  }

  @Get('history')
  @ApiOperation({ summary: 'Last fifteen temperature readings (oldest first).' })
  @ApiOkResponse({ type: TemperatureHistoryResponseDto, isArray: true })
  public async getHistory(): Promise<TemperatureHistoryResponseDto[]> {
    const temperatureHistories: TemperatureHistory[] = await this.getTemperatureHistory.execute();
    return this.dtoMapper.domainsToDto(temperatureHistories);
  }

  @Get('thresholds')
  @ApiOperation({ summary: 'Active COLD/HOT boundary configuration.' })
  @ApiOkResponse({ type: SensorThresholdsResponseDto })
  public async getBounds(): Promise<SensorThresholdsResponseDto> {
    const sensorThresholds: SensorThresholds = await this.getThresholds.execute();
    return this.dtoMapper.thresholdsDomainToDto(sensorThresholds);
  }

  @Put('thresholds')
  @ApiOperation({ summary: 'Replace HOT/COLD boundaries (WARM is the intermediate band).' })
  @ApiOkResponse({ type: SensorThresholdsResponseDto })
  public async putBounds(@Body() body: UpdateThresholdsDto): Promise<SensorThresholdsResponseDto> {
    const sensorThresholds: SensorThresholds = this.dtoMapper.updateThresholdsDtoToDomain(body);
    const updatedSensorThresholds: SensorThresholds = await this.updateThresholds.execute(sensorThresholds);
    return this.dtoMapper.thresholdsDomainToDto(updatedSensorThresholds);
  }
}
