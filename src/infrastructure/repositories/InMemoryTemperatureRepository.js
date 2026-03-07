const ITemperatureRepository = require('../../domain/ports/ITemperatureRepository');

const HISTORY_LIMIT = 15;

class InMemoryTemperatureRepository extends ITemperatureRepository {
  constructor() {
    super();
    this.history = [];
  }

  save(reading) {
    this.history.unshift(reading);
    if (this.history.length > HISTORY_LIMIT) {
      this.history = this.history.slice(0, HISTORY_LIMIT);
    }
    return Promise.resolve(reading);
  }

  getHistory() {
    return Promise.resolve([...this.history]);
  }
}

module.exports = InMemoryTemperatureRepository;