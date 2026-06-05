export class GetThresholds {
    thresholdsRepository;
    constructor(thresholdsRepository) {
        this.thresholdsRepository = thresholdsRepository;
    }
    async execute() {
        const coldThreshold = await this.thresholdsRepository.findCold();
        const hotThreshold = await this.thresholdsRepository.findHot();
        return {
            cold: coldThreshold ? coldThreshold.value : 22,
            hot: hotThreshold ? hotThreshold.value : 35
        };
    }
}
