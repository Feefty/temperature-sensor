class TemperatureReading {
  constructor(temperature, state, timestamp = new Date()) {
    this.temperature = temperature;
    this.state = state;
    this.timestamp = timestamp;
  }
}

module.exports = TemperatureReading;