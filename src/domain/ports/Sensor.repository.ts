import { Sensor } from "../entities/Sensor";

export interface SensorRepository {
    get(): Promise<Sensor>;
    save(sensor: Sensor): Promise<void>;
}