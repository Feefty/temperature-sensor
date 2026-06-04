import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';
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
  current?: Thresholds;
  onSaved?: (thresholds: Thresholds) => void;
}

const ERROR_ID = 'thresholds-error';
const parse = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

export function ThresholdSettings({
  current = DEFAULT_THRESHOLDS,
  onSaved,
}: ThresholdSettingsProps) {
  const [coldMax, setColdMax] = useState(String(current.coldMax));
  const [hotMin, setHotMin] = useState(String(current.hotMin));
  const [saved, setSaved] = useState(false);
  const { redefine, isSaving, error } = useRedefineThresholds();
  const saving = useDelayedFlag(isSaving);
  // While the user is mid-edit the form is theirs; sync from `current` only when untouched, so a
  // late GET /thresholds (or a re-tint) cannot overwrite in-progress input. The flag resets on a
  // successful save, so the form tracks the server again afterwards.
  const touched = useRef(false);

  useEffect(() => {
    if (touched.current) return;
    setColdMax(String(current.coldMax));
    setHotMin(String(current.hotMin));
  }, [current.coldMax, current.hotMin]);

  const cold = parse(coldMax);
  const hot = parse(hotMin);
  const outOfRange = (value: number) => value < SENSOR_MIN || value > SENSOR_MAX;
  const orderBad = Number.isFinite(cold) && Number.isFinite(hot) && cold >= hot;
  // Per-field validity, so a sound field is never announced as invalid just because the other
  // one is. The cold < hot rule taints both fields, since editing either can satisfy it.
  const coldInvalid = !Number.isFinite(cold) || outOfRange(cold) || orderBad;
  const hotInvalid = !Number.isFinite(hot) || outOfRange(hot) || orderBad;
  const invalid = coldInvalid || hotInvalid;
  const message = invalid ? COPY.invalid : error ? error.message : '';

  // Editing supersedes the previous save, so drop the stale confirmation as soon as a value changes.
  const edit = (set: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    touched.current = true;
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
      touched.current = false;
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
          aria-invalid={coldInvalid || undefined}
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
          aria-invalid={hotInvalid || undefined}
          aria-describedby={message ? ERROR_ID : undefined}
        />

        {/* Fixed-height slot so showing an error or confirmation never resizes the card. The error
            is the fields' aria-describedby target (paired with per-field aria-invalid) and a polite
            live region, so a validation change is announced gently rather than assertively. */}
        <div className={styles.messages}>
          <p id={ERROR_ID} className={styles.error} aria-live="polite">
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
