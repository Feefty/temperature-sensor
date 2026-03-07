const GetTemperature = require('../../../domain/usecases/GetTemperature');
const GetHistory = require('../../../domain/usecases/GetHistory');
const UpdateThresholds = require('../../../domain/usecases/UpdateThresholds');

class TemperatureController {
  constructor(sensor, repository) {
    this.getTemperatureUC = new GetTemperature(sensor, repository);
    this.getHistoryUC = new GetHistory(repository);
    this.updateThresholdsUC = new UpdateThresholds();
  }

  async getTemperature(req, res) {
    try {
      const reading = await this.getTemperatureUC.execute();
      res.json(reading);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getHistory(req, res) {
    try {
      const history = await this.getHistoryUC.execute();
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  updateThresholds(req, res) {
    try {
      const thresholds = this.updateThresholdsUC.execute(req.body);
      res.json(thresholds);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = TemperatureController;