import { PrismaClient } from "../../../db/generated/client";
import { TemperatureHistory } from "../../domain/entities/TemperatureHistory";
import { HistoryRepository } from "../../domain/ports/History.repository";
import { State } from "../../domain/entities/Sensor";

export class PrismaHistoryRepository implements HistoryRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async getMany(limit: number, orderBy: "asc" | "desc"): Promise<TemperatureHistory[]> {
        const histories = await this.prisma.temperatureHistory.findMany({
            take: limit,
            orderBy: {
                createdAt: orderBy,
            },
        });
        return histories.map((history) => ({
            temperature: history.temperature,
            state: history.state as State,
            timestamp: history.createdAt,
        }));
    }

    async save(temperature: TemperatureHistory): Promise<void> {
        await this.prisma.temperatureHistory.create({
            data: {
                temperature: temperature.temperature,
                state: temperature.state,
                createdAt: temperature.timestamp,
                updatedAt: temperature.timestamp,
            },
        });
    }
}