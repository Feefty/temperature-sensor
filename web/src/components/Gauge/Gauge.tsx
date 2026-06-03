import { DEFAULT_THRESHOLDS, SENSOR_MAX, SENSOR_MIN } from '@/domain';
import type { SensorState } from '@/types';
import { arcPath, pointOnArc, valueToAngle } from './geometry';
import styles from './Gauge.module.css';

const CX = 100;
const CY = 100;
const R = 80;

export interface GaugeProps {
  value: number;
  state: SensorState;
  coldMax?: number;
  hotMin?: number;
}

const stateClass: Record<SensorState, string | undefined> = {
  COLD: styles.cold,
  WARM: styles.warm,
  HOT: styles.hot,
};

// Decorative: the numeric value and StatusBadge next to it carry the meaning for assistive tech.
export function Gauge({
  value,
  state,
  coldMax = DEFAULT_THRESHOLDS.coldMax,
  hotMin = DEFAULT_THRESHOLDS.hotMin,
}: GaugeProps) {
  // Order the boundaries so a crossed coldMax/hotMin still draws left-to-right zone arcs.
  const lower = Math.min(
    valueToAngle(coldMax, SENSOR_MIN, SENSOR_MAX),
    valueToAngle(hotMin, SENSOR_MIN, SENSOR_MAX),
  );
  const upper = Math.max(
    valueToAngle(coldMax, SENSOR_MIN, SENSOR_MAX),
    valueToAngle(hotMin, SENSOR_MIN, SENSOR_MAX),
  );
  // The marker sits at the arc's start and is rotated around the centre into position, so it
  // travels ALONG the arc (a transition on the rotation) rather than across the chord.
  const angle = valueToAngle(value, SENSOR_MIN, SENSOR_MAX);
  const start = pointOnArc(CX, CY, R, 0);

  return (
    <svg viewBox="0 0 200 116" className={styles.gauge} aria-hidden="true" focusable="false">
      <path d={arcPath(CX, CY, R, 0, 180)} className={styles.track} />
      <path d={arcPath(CX, CY, R, 0, lower)} className={styles.cold} />
      <path d={arcPath(CX, CY, R, lower, upper)} className={styles.warm} />
      <path d={arcPath(CX, CY, R, upper, 180)} className={styles.hot} />
      <circle
        cx={start.x}
        cy={start.y}
        r="8"
        className={[styles.marker, stateClass[state]].filter(Boolean).join(' ')}
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </svg>
  );
}
