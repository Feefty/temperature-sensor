import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Spinner } from '@/components/Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    isLoading = false,
    type = 'button',
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      <span className={styles.label}>
        {/* Decorative while loading: aria-busy carries the state, so the spinner stays out of the name. */}
        {isLoading ? (
          <span className={styles.spinnerSlot} aria-hidden="true">
            <Spinner size="sm" />
          </span>
        ) : null}
        {children}
      </span>
    </button>
  );
});
