import { SENSOR_MAX, SENSOR_MIN } from '@/domain';

// Server-room framing for the threshold form.
export const COPY = {
  title: 'Cooling thresholds',
  coldMax: 'Cold below (°C)',
  hotMin: 'Hot from (°C)',
  coldHint: 'Below this the rack reads COLD.',
  hotHint: 'At or above this the rack reads HOT.',
  apply: 'Apply thresholds',
  invalid: `Use ${SENSOR_MIN} to ${SENSOR_MAX} °C, cold below hot.`,
  saved: 'Thresholds updated.',
};
