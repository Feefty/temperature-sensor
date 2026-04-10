import { SensorEntity } from "../../domain/entities/Sensor";
import { TemperatureHistory } from "../../domain/entities/TemperatureHistory";
import { HistoryRepository } from "../../domain/ports/History.repository";
import { SensorRepository } from "../../domain/ports/Sensor.repository";
import { TemperatureSensorRepository } from "../../domain/ports/TemperatureSensor.repository";

export interface GetTemperatureStateUseCase {
    execute(): Promise<TemperatureHistory>;
}

export class GetTemperatureStateUseCaseImpl implements GetTemperatureStateUseCase {
    constructor(private readonly sensorRepository: SensorRepository, private readonly temperatureSensor: TemperatureSensorRepository, private readonly historyRepository: HistoryRepository) { }

    async execute(): Promise<TemperatureHistory> {
        const temperatureSensor = await this.temperatureSensor.get()
        const sensor = await this.sensorRepository.get()
        const sensorEntity = new SensorEntity(sensor.maxTemperature, sensor.minTemperature)
        const historyEntry = {
            temperature: temperatureSensor.temperature,
            state: sensorEntity.evaluate(temperatureSensor),
            timestamp: new Date(),
        }
        await this.historyRepository.save(historyEntry)

        return historyEntry
    }
}
