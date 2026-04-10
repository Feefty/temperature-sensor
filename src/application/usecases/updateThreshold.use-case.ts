import { SensorEntity } from "../../domain/entities/Sensor";
import { SensorRepository } from "../../domain/ports/Sensor.repository";

export interface UpdateThresholdUseCase {
    execute(maxTemperature: number, minTemperature: number): Promise<void>;
}

export class UpdateThresholdUseCaseImpl implements UpdateThresholdUseCase {
    constructor(private readonly sensorRepository: SensorRepository) { }

    async execute(maxTemperature: number, minTemperature: number): Promise<void> {
        const sensor = new SensorEntity(maxTemperature, minTemperature)
        await this.sensorRepository.save(sensor)
    }
}   