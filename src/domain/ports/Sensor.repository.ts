import { Sensor, SensorEntity } from "../entities/Sensor";

export interface SensorRepository {
    get(): Promise<SensorEntity>;
    save(sensor: Sensor): Promise<void>;
}