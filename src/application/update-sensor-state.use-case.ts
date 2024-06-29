import { Injectable } from '@nestjs/common'
import { Sensor } from '../domain/sensor.entity'
import { Temperature } from '../domain/temperature.entity'
import { ConfigService } from '@src/config/config.service'

@Injectable()
export class UpdateSensorStateUseCase {
    constructor(private readonly configService: ConfigService) {}

    execute(sensor: Sensor, temperature: Temperature): void {
        const hotThreshold = this.configService.getHotThreshold()
        const coldThreshold = this.configService.getColdThreshold()

        if (temperature.value >= hotThreshold) {
            sensor.state = 'HOT'
        } else if (temperature.value < coldThreshold) {
            sensor.state = 'COLD'
        } else {
            sensor.state = 'WARM'
        }
    }
}
