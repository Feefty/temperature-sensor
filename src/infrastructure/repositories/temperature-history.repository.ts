import { Injectable } from '@nestjs/common'
import { Temperature } from '../../domain/temperature.entity'

@Injectable()
export class TemperatureHistoryRepository {
    private history: Temperature[] = []

    add(temperature: Temperature): void {
        if (this.history.length >= 15) {
            this.history.shift()
        }
        this.history.push(temperature)
    }

    getHistory(): Temperature[] {
        return this.history
    }
}
