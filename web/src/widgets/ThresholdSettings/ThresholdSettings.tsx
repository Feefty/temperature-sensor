import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useRedefineThresholds } from '@/api';
import { DEFAULT_THRESHOLDS, SENSOR_MAX, SENSOR_MIN } from '@/domain';
import { useDelayedFlag } from '@/hooks';
import type { Thresholds } from '@/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { COPY } from './scheme';
import styles from './ThresholdSettings.module.css';

export interface ThresholdSettingsProps {
  onSaved?: (thresholds: Thresholds) => void;
}

const ERROR_ID = 'thresholds-error';
const parse = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

export function ThresholdSettings({ onSaved }: ThresholdSettingsProps) {
  const [coldMax, setColdMax] = useState(String(DEFAULT_THRESHOLDS.coldMax));
  const [hotMin, setHotMin] = useState(String(DEFAULT_THRESHOLDS.hotMin));
  const [saved, setSaved] = useState(false);
  const { redefine, isSaving, error } = useRedefineThresholds();
  const saving = useDelayedFlag(isSaving);

  const cold = parse(coldMax);
  const hot = parse(hotMin);
  const outOfRange = (value: number) => value < SENSOR_MIN || value > SENSOR_MAX;
  const invalid =
    !Number.isFinite(cold) ||
    !Number.isFinite(hot) ||
    outOfRange(cold) ||
    outOfRange(hot) ||
    cold >= hot;
  const message = invalid ? COPY.invalid : error ? error.message : '';

  // Editing supersedes the previous save, so drop the stale confirmation as soon as a value changes.
  const edit = (set: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    set(event.target.value);
    setSaved(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (invalid || isSaving) return;
    setSaved(false);
    try {
      const result = await redefine({ coldMax: cold, hotMin: hot });
      setSaved(true);
      onSaved?.(result);
    } catch {
      // The hook records the error; it is surfaced below.
    }
  };

  return (
    <Card role="region" aria-labelledby="thresholds-title">
      <h2 id="thresholds-title" className={styles.title}>
        {COPY.title}
      </h2>
      <form className={styles.form} onSubmit={submit} noValidate>
        <Field
          label={COPY.coldMax}
          type="number"
          min={SENSOR_MIN}
          max={SENSOR_MAX}
          value={coldMax}
          onChange={edit(setColdMax)}
          hint={COPY.coldHint}
          aria-invalid={invalid || undefined}
          aria-describedby={message ? ERROR_ID : undefined}
        />
        <Field
          label={COPY.hotMin}
          type="number"
          min={SENSOR_MIN}
          max={SENSOR_MAX}
          value={hotMin}
          onChange={edit(setHotMin)}
          hint={COPY.hotHint}
          aria-invalid={invalid || undefined}
          aria-describedby={message ? ERROR_ID : undefined}
        />

        {/* Fixed-height slot so showing an error or confirmation never resizes the card. */}
        <div className={styles.messages}>
          <p id={ERROR_ID} role="alert" className={styles.error}>
            {message}
          </p>
          <p role="status" className={styles.saved}>
            {saved && !invalid && !error ? COPY.saved : ''}
          </p>
        </div>

        <Button type="submit" className={styles.submit} isLoading={saving} disabled={invalid}>
          {COPY.apply}
        </Button>
      </form>
    </Card>
  );
}
