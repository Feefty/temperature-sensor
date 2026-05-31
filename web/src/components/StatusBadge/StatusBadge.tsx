import type { HTMLAttributes, ReactElement } from 'react';
import type { SensorState } from '@/types';
import { STATE_LABEL } from './scheme';
import styles from './StatusBadge.module.css';

const ICONS: Record<SensorState, ReactElement> = {
  COLD: (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2v20M4 7l16 10M20 7L4 17" />
    </svg>
  ),
  WARM: (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  ),
  HOT: (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13 2c.5 4-2 5-2 8a2 2 0 0 0 4 0c2 2 3 4 3 6a6 6 0 0 1-12 0c0-4 3-6 4-9 .8 1.2 2 2 3 2 .3-2-1-4-2-7z" />
    </svg>
  ),
};

const STATE_CLASS: Record<SensorState, string | undefined> = {
  COLD: styles.cold,
  WARM: styles.warm,
  HOT: styles.hot,
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  state: SensorState;
}

export function StatusBadge({ state, className, ...rest }: StatusBadgeProps) {
  return (
    <span
      {...rest}
      className={[styles.badge, STATE_CLASS[state], className].filter(Boolean).join(' ')}
    >
      <span className={styles.icon}>{ICONS[state]}</span>
      {STATE_LABEL[state]}
    </span>
  );
}
