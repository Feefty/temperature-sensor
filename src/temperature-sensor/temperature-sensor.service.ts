import { Injectable } from '@nestjs/common'
import { Sensor } from '../domain/sensor.entity'
import { Temperature } from '../domain/temperature.entity'
import { UpdateSensorStateUseCase } from '../application/update-sensor-state.use-case'

@Injectable()
export class TemperatureSensorService {
    private readonly sensor: Sensor = new Sensor('1', 'WARM')
    private readonly temperatures: Temperature[] = []

    constructor(
        private readonly updateSensorStateUseCase: UpdateSensorStateUseCase,
    ) {}

    getCurrentTemperature(): Temperature {
        const temperatureValue = Math.random() * 50
        const temperature = new Temperature(temperatureValue)
        this.temperatures.push(temperature)
        if (this.temperatures.length > 15) {
            this.temperatures.shift()
        }
        this.updateSensorState(temperature)
        return temperature
    }

    updateSensorState(temperature: Temperature): Sensor {
        this.updateSensorStateUseCase.execute(this.sensor, temperature)
        return this.sensor
    }

    getSensorState(): Sensor {
        return this.sensor
    }

    getTemperatureHistory(): Temperature[] {
        return this.temperatures
    }
}
