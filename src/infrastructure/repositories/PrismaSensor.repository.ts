import { PrismaClient } from "../../../db/generated/client";
import { SensorRepository } from "../../domain/ports/Sensor.repository";
import { Sensor } from "../../domain/entities/Sensor";

export class PrismaSensorRepository implements SensorRepository {

    constructor(private readonly prisma: PrismaClient) {

    }
    async get(): Promise<Sensor> {
        const maxTemperature = await this.prisma.sensorConfig.findUniqueOrThrow({ where: { key: "maxTemperature" } })
        const minTemperature = await this.prisma.sensorConfig.findUniqueOrThrow({ where: { key: "minTemperature" } })
        return { maxTemperature: maxTemperature.value, minTemperature: minTemperature.value };
    }
    async save(sensor: Sensor): Promise<void> {
        await this.prisma.$transaction([
            this.prisma.sensorConfig.upsert({
                where: {
                    key: "maxTemperature",
                },
                update: {
                    value: sensor.maxTemperature,
                },
                create: {
                    key: "maxTemperature",
                    value: sensor.maxTemperature,
                },
            }),
            this.prisma.sensorConfig.upsert({
                where: {
                    key: "minTemperature",
                },
                update: {
                    value: sensor.minTemperature,
                },
                create: {
                    key: "minTemperature",
                    value: sensor.minTemperature,
                },
            }),
        ])
    }
}