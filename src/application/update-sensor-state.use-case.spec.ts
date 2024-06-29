import { UpdateSensorStateUseCase } from './update-sensor-state.use-case'
import { Sensor } from '../domain/sensor.entity'
import { Temperature } from '../domain/temperature.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@src/config/config.service'

describe('UpdateSensorStateUseCase', () => {
    let useCase: UpdateSensorStateUseCase
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UpdateSensorStateUseCase, ConfigService],
        }).compile()
        configService = module.get<ConfigService>(ConfigService)
        useCase = new UpdateSensorStateUseCase(configService)
    })

    it('should set state to HOT when temperature >= 35', () => {
        const sensor = new Sensor('1', 'WARM')
        const temperature = new Temperature(35)
        useCase.execute(sensor, temperature)
        expect(sensor.state).toBe('HOT')
    })

    it('should set state to COLD when temperature < 22', () => {
        const sensor = new Sensor('1', 'WARM')
        const temperature = new Temperature(21)
        useCase.execute(sensor, temperature)
        expect(sensor.state).toBe('COLD')
    })

    it('should set state to WARM when temperature is between 22 and 34', () => {
        const sensor = new Sensor('1', 'COLD')
        const temperature = new Temperature(25)
        useCase.execute(sensor, temperature)
        expect(sensor.state).toBe('WARM')
    })
})
