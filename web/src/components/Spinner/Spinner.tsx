import type { HTMLAttributes } from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      {...rest}
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      role="status"
    >
      <span className={styles.square} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
