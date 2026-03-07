const { getState } = require('../entities/SensorState');
const TemperatureReading = require('../entities/TemperatureReading');

class GetTemperature {
  constructor(sensor, repository) {
    this.sensor = sensor;
    this.repository = repository;
  }

  async execute() {
    const temperature = await this.sensor.getTemperature();
    const state = getState(temperature);
    const reading = new TemperatureReading(temperature, state);
    await this.repository.save(reading);
    return reading;
  }
}

module.exports = GetTemperature;