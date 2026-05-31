import { type InputHTMLAttributes, useId } from 'react';
import styles from './Field.module.css';

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Field({
  label,
  hint,
  id,
  className,
  'aria-describedby': describedBy,
  ...rest
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  // Keep the hint association when the caller also passes its own describer (e.g. an error id).
  const describedByIds = [hintId, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <input {...rest} id={fieldId} className={styles.input} aria-describedby={describedByIds} />
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
