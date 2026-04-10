import { TemperatureSensor } from "../entities/TemperatureSensor";

export interface TemperatureSensorRepository {
    get(): Promise<TemperatureSensor>;
}