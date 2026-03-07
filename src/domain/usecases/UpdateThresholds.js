const { setThresholds, getThresholds } = require('../entities/SensorState');

class UpdateThresholds {
  execute({ hot, cold }) {
    if (typeof hot !== 'number' || typeof cold !== 'number') {
      throw new Error('Thresholds must be numbers');
    }
    if (cold >= hot) {
      throw new Error('Cold threshold must be less than hot threshold');
    }
    setThresholds({ hot, cold });
    return getThresholds();
  }
}

module.exports = UpdateThresholds;