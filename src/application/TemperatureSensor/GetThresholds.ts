import type { ThresholdsRepository } from "../../domain/TemperatureSensor/ThresholdsRepository.js";

export class GetThresholds { 
    constructor(private thresholdsRepository: ThresholdsRepository) {}

    async execute(): Promise<{ cold: number, hot: number }> {
        const coldThreshold = await this.thresholdsRepository.findCold();
        const hotThreshold = await this.thresholdsRepository.findHot();

        return {
            cold: coldThreshold ? coldThreshold.value : 22,
            hot: hotThreshold ? hotThreshold.value : 35
        };  
    } 
}