import type { ThresholdsRepository } from "../../domain/TemperatureSensor/ThresholdsRepository.js";

export class PostThresholds {
    constructor(private thresholdsRepository: ThresholdsRepository) {}

    async executeCold(cold: number): Promise<void> {
        const threshold = { value: cold, state: 'cold' }
        await this.thresholdsRepository.saveCold(threshold);
    }

    async executeHot(hot: number): Promise<void> {
        const threshold = { value: hot, state: 'hot' }
        await this.thresholdsRepository.saveHot(threshold);
    }
}
