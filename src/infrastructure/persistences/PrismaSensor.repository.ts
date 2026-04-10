import { PrismaClient } from "../../../db/generated/client";
import { SensorRepository } from "../../domain/ports/Sensor.repository";
import { Sensor, SensorEntity } from "../../domain/entities/Sensor";

export class PrismaSensorRepository implements SensorRepository {


    constructor(private readonly prisma: PrismaClient) {

    }
    async get(): Promise<SensorEntity> {
        const sensor = await this.prisma.sensor.findFirst()
        if (!sensor) {
            throw new Error("Sensor not found");
        }
        return new SensorEntity(sensor.maxTemperature, sensor.minTemperature);
    }
    async save(sensor: Sensor): Promise<void> {
        await this.prisma.sensor.upsert({
            where: {
                id: 1,
            },
            update: {
                maxTemperature: sensor.maxTemperature,
                minTemperature: sensor.minTemperature,
            },
            create: {
                id: 1,
                maxTemperature: sensor.maxTemperature,
                minTemperature: sensor.minTemperature,
            },
        });
    }
}