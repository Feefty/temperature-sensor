const ITemperatureSensor = require('../../domain/ports/ITemperatureSensor');

class TemperatureSensor extends ITemperatureSensor {
  getTemperature() {
    // To simulate a real sensore i generate a random value between 15°C and 45°C
    return Promise.resolve(
      parseFloat((Math.random() * 30 + 15).toFixed(2))
    );
  }
}

module.exports = TemperatureSensor;