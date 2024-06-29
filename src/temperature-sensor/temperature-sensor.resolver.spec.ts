import { Test, TestingModule } from '@nestjs/testing'
import { TemperatureSensorResolver } from './temperature-sensor.resolver'
import { UpdateSensorStateUseCase } from '../application/update-sensor-state.use-case'
import { TemperatureSensorService } from './temperature-sensor.service'
import { TemperatureHistoryRepository } from '../infrastructure/repositories/temperature-history.repository'
import { ConfigService } from '@src/config/config.service'

describe('SensorResolver', () => {
    let resolver: TemperatureSensorResolver
    let temperatureSensorService: TemperatureSensorService
    let updateSensorStateUseCase: UpdateSensorStateUseCase
    let temperatureHistoryRepository: TemperatureHistoryRepository
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TemperatureSensorResolver,
                TemperatureSensorService,
                UpdateSensorStateUseCase,
                TemperatureHistoryRepository,
                ConfigService,
            ],
        }).compile()

        resolver = module.get<TemperatureSensorResolver>(
            TemperatureSensorResolver,
        )
        temperatureSensorService = module.get<TemperatureSensorService>(
            TemperatureSensorService,
        )
        updateSensorStateUseCase = module.get<UpdateSensorStateUseCase>(
            UpdateSensorStateUseCase,
        )
        temperatureHistoryRepository = module.get<TemperatureHistoryRepository>(
            TemperatureHistoryRepository,
        )
        configService = module.get<ConfigService>(ConfigService)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    it('should set thresholds correctly', () => {
        resolver.setThresholds(40, 18)
        expect(configService.getHotThreshold()).toBe(40)
        expect(configService.getColdThreshold()).toBe(18)
    })

    it('should get sensor state correctly', () => {
        const sensorState = resolver.getSensorState()
        expect(sensorState).toBeDefined()
        expect(sensorState.id).toBe('1')
        // Check if state is either HOT, COLD, or WARM
        expect(['HOT', 'COLD', 'WARM']).toContain(sensorState.state)
    })

    it('should get current temperature', () => {
        const temperature = resolver.getTemperature()
        expect(temperature).toBeDefined()
        expect(temperature.value).toBeGreaterThanOrEqual(0)
        expect(temperature.value).toBeLessThanOrEqual(50)
    })

    it('should get temperature history', () => {
        const temperatures = resolver.getTemperatureHistory()
        expect(temperatures).toBeDefined()
        expect(Array.isArray(temperatures)).toBe(true)
    })
})
