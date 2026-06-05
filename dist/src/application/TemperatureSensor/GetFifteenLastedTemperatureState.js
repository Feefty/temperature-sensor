export class GetFifteenLastedTemperatureState {
    temperatureSensorRepository;
    constructor(temperatureSensorRepository) {
        this.temperatureSensorRepository = temperatureSensorRepository;
    }
    async execute() {
        return this.temperatureSensorRepository.getFifteenLastedTemperatureState();
    }
}
