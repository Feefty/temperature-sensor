import type { SensorState } from '@/types';
import { arcPath, pointOnArc, valueToAngle } from './geometry';
import styles from './Gauge.module.css';

const CX = 100;
const CY = 100;
const R = 80;
const SCALE_MIN = -10;
const SCALE_MAX = 50;

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
export function Gauge({ value, state, coldMax = 22, hotMin = 35 }: GaugeProps) {
  // Order the boundaries so a crossed coldMax/hotMin still draws left-to-right zone arcs.
  const lower = Math.min(
    valueToAngle(coldMax, SCALE_MIN, SCALE_MAX),
    valueToAngle(hotMin, SCALE_MIN, SCALE_MAX),
  );
  const upper = Math.max(
    valueToAngle(coldMax, SCALE_MIN, SCALE_MAX),
    valueToAngle(hotMin, SCALE_MIN, SCALE_MAX),
  );
  const marker = pointOnArc(CX, CY, R, valueToAngle(value, SCALE_MIN, SCALE_MAX));

  return (
    <svg viewBox="0 0 200 116" className={styles.gauge} aria-hidden="true" focusable="false">
      <path d={arcPath(CX, CY, R, 0, 180)} className={styles.track} />
      <path d={arcPath(CX, CY, R, 0, lower)} className={styles.cold} />
      <path d={arcPath(CX, CY, R, lower, upper)} className={styles.warm} />
      <path d={arcPath(CX, CY, R, upper, 180)} className={styles.hot} />
      <circle
        cx={marker.x}
        cy={marker.y}
        r="8"
        className={[styles.marker, stateClass[state]].filter(Boolean).join(' ')}
      />
    </svg>
  );
}
