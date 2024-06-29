import { Module } from '@nestjs/common'
import { UpdateSensorStateUseCase } from '@src/application/update-sensor-state.use-case'
import { ConfigService } from '@src/config/config.service'
import { TemperatureHistoryRepository } from '@src/infrastructure/repositories/temperature-history.repository'
import { TemperatureSensorResolver } from '@src/temperature-sensor/temperature-sensor.resolver'
import { TemperatureSensorService } from '@src/temperature-sensor/temperature-sensor.service'

@Module({
    providers: [
        TemperatureSensorResolver,
        TemperatureSensorService,
        UpdateSensorStateUseCase,
        TemperatureHistoryRepository,
        ConfigService,
    ],
    exports: [TemperatureSensorService],
})
export class TemperatureSensorModule {}
