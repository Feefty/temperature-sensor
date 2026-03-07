class ITemperatureRepository {
  save(reading) {
    throw new Error('save() must be implemented');
  }
  getHistory() {
    throw new Error('getHistory() must be implemented');
  }
}

module.exports = ITemperatureRepository;