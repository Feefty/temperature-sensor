import { Sensor } from "../../domain/entities/Sensor";
import { SensorRepository } from "../../domain/ports/Sensor.repository";

export interface UpdateThresholdUseCase {
    execute(sensor: Sensor): Promise<void>;
}

export class UpdateThresholdUseCaseImpl implements UpdateThresholdUseCase {
    constructor(private readonly sensorRepository: SensorRepository) { }

    async execute(sensor: Sensor): Promise<void> {

        await this.sensorRepository.save(sensor)
    }
}