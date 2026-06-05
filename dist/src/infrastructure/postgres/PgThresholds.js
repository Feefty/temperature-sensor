export class PgThresholds {
    db;
    constructor(db) {
        this.db = db;
    }
    async upsertByState(threshold) {
        const existing = await this.db
            .selectFrom('thresholds')
            .select(['value', 'state'])
            .where('state', '=', threshold.state)
            .executeTakeFirst();
        if (existing) {
            await this.db
                .updateTable('thresholds')
                .set({ value: threshold.value })
                .where('state', '=', threshold.state)
                .execute();
            return;
        }
        await this.db
            .insertInto('thresholds')
            .values({
            value: threshold.value,
            state: threshold.state,
        })
            .execute();
    }
    async saveCold(threshold) {
        await this.upsertByState({ ...threshold });
    }
    async saveHot(threshold) {
        await this.upsertByState({ ...threshold });
    }
    async findCold() {
        const result = await this.db
            .selectFrom('thresholds')
            .where('state', '=', 'cold')
            .selectAll()
            .execute();
        return result[0] ? { value: result[0].value, state: result[0].state } : null;
    }
    async findHot() {
        const result = await this.db
            .selectFrom('thresholds')
            .where('state', '=', 'hot')
            .selectAll()
            .execute();
        return result[0] ? { value: result[0].value, state: result[0].state } : null;
    }
}
