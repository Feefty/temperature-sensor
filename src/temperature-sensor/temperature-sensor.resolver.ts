import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Temperature } from '../domain/temperature.entity'
import { Sensor } from '../domain/sensor.entity'
import { UpdateSensorStateUseCase } from '../application/update-sensor-state.use-case'
import { TemperatureSensorService } from './temperature-sensor.service'
import { TemperatureHistoryRepository } from '../infrastructure/repositories/temperature-history.repository'
import { ConfigService } from '@src/config/config.service'

@Resolver((_of: any) => Sensor)
export class TemperatureSensorResolver {
    constructor(
        private readonly temperatureSensorService: TemperatureSensorService,
        private readonly updateSensorStateUseCase: UpdateSensorStateUseCase,
        private readonly temperatureHistoryRepository: TemperatureHistoryRepository,
        private readonly configService: ConfigService,
    ) {}

    @Query((returns) => Temperature)
    getTemperature() {
        const temperature =
            this.temperatureSensorService.getCurrentTemperature()
        this.temperatureHistoryRepository.add(temperature)
        return temperature
    }

    @Query((returns) => [Temperature])
    getTemperatureHistory() {
        return this.temperatureHistoryRepository.getHistory()
    }

    @Query((returns) => Sensor)
    getSensorState() {
        return this.temperatureSensorService.getSensorState()
    }

    @Mutation((returns) => Boolean)
    setThresholds(@Args('hot') hot: number, @Args('cold') cold: number) {
        this.configService.setHotThreshold(hot)
        this.configService.setColdThreshold(cold)
        return true
    }
}
