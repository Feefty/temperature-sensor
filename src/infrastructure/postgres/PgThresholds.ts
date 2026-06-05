import type { DB } from "../../../db.js";
import type { Thresholds } from "../../domain/TemperatureSensor/Thresholds.js";
import type { ThresholdsRepository } from "../../domain/TemperatureSensor/ThresholdsRepository.js";

export class PgThresholds implements ThresholdsRepository {
    constructor(private db: DB) {}

    private async upsertByState(threshold: Thresholds): Promise<void> {
        const existing = await this.db
            .selectFrom('thresholds')
            .select(['value', 'state'])
            .where('state', '=', threshold.state)
            .executeTakeFirst()

        if (existing) {
            await this.db
                .updateTable('thresholds')
                .set({ value: threshold.value })
                .where('state', '=', threshold.state)
                .execute()
            return
        }

        await this.db
            .insertInto('thresholds')
            .values({
                value: threshold.value,
                state: threshold.state,
            })
            .execute()
    }

    async saveCold(threshold: Thresholds): Promise<void> {
        await this.upsertByState({ ...threshold })
    }

    async saveHot(threshold: Thresholds): Promise<void> {
        await this.upsertByState({ ...threshold })
    }

    async findCold(): Promise<Thresholds | null> {
        const result = await this.db
            .selectFrom('thresholds')
            .where('state', '=', 'cold')
            .selectAll()
            .execute()

        return result[0] ? { value: result[0].value, state: result[0].state } : null
    }

    async findHot(): Promise<Thresholds | null> {
        const result = await this.db
            .selectFrom('thresholds')
            .where('state', '=', 'hot')
            .selectAll()
            .execute()

        return result[0] ? { value: result[0].value, state: result[0].state } : null
    }
}