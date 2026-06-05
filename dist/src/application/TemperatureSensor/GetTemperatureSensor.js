import { TemperatureSensor } from '../../domain/TemperatureSensor/TemperatureSensor.js';
export class GetTemperatureSensor {
    temperatureSensorRepository;
    thresholdsRepository;
    constructor(temperatureSensorRepository, thresholdsRepository) {
        this.temperatureSensorRepository = temperatureSensorRepository;
        this.thresholdsRepository = thresholdsRepository;
    }
    async execute() {
        const value = Math.floor(Math.random() * 40);
        const coldThreshold = await this.thresholdsRepository.findCold();
        const hotThreshold = await this.thresholdsRepository.findHot();
        const cold = coldThreshold?.value ?? 22;
        const hot = hotThreshold?.value ?? 35;
        let state = 'warm';
        if (value <= cold) {
            state = 'cold';
        }
        else if (value >= hot) {
            state = 'hot';
        }
        const temperatureSensor = new TemperatureSensor('', value, state, null);
        await this.temperatureSensorRepository.save(temperatureSensor);
        return { value: temperatureSensor.value, state: temperatureSensor.state };
    }
}
