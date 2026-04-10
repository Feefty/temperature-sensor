import { TemperatureSensor } from "../../domain/entities/TemperatureSensor";
import { TemperatureSensorRepository } from "../../domain/ports/TemperatureSensor.repository";

export class SimulatedTemperatureSensor implements TemperatureSensorRepository {
    async get(): Promise<TemperatureSensor> {
        const temp = Math.random() * 50;
        return { temperature: parseFloat(temp.toFixed(2)) };
    }
}