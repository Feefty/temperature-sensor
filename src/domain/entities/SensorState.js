const DEFAULT_THRESHOLDS = { hot: 35, cold: 22 };
let thresholds = { ...DEFAULT_THRESHOLDS };

const getState = (temperature) => {
  if (temperature >= thresholds.hot) return 'HOT';
  if (temperature < thresholds.cold) return 'COLD';
  return 'WARM';
};

const setThresholds = ({ hot, cold }) => {
  thresholds = { hot, cold };
};

const getThresholds = () => ({ ...thresholds });

module.exports = { getState, setThresholds, getThresholds };