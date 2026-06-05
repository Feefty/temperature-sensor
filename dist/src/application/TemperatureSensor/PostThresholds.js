export class PostThresholds {
    thresholdsRepository;
    constructor(thresholdsRepository) {
        this.thresholdsRepository = thresholdsRepository;
    }
    async executeCold(cold) {
        const threshold = { value: cold, state: 'cold' };
        await this.thresholdsRepository.saveCold(threshold);
    }
    async executeHot(hot) {
        const threshold = { value: hot, state: 'hot' };
        await this.thresholdsRepository.saveHot(threshold);
    }
}
