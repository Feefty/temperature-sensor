class ITemperatureSensor {
  getTemperature() {
    throw new Error('getTemperature() must be implemented');
  }
}

module.exports = ITemperatureSensor;