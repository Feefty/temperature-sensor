import { useLiveReading } from '@/api';
import { DEFAULT_THRESHOLDS } from '@/domain';
import { formatTime } from '@/format';
import type { Thresholds } from '@/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Gauge } from '@/components/Gauge';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { COPY } from './scheme';
import styles from './LiveReading.module.css';

export interface LiveReadingProps {
  pollMs?: number;
  thresholds?: Thresholds;
  refreshKey?: number;
}

export function LiveReading({
  pollMs = 5000,
  thresholds = DEFAULT_THRESHOLDS,
  refreshKey = 0,
}: LiveReadingProps) {
  const { data, error, isLoading, refetch } = useLiveReading(pollMs, refreshKey);

  return (
    <Card role="region" aria-labelledby="rack-sensor-title">
      <h2 id="rack-sensor-title" className={styles.title}>
        {COPY.title}
      </h2>

      {data ? (
        <div className={styles.reading}>
          <Gauge
            value={data.temperature}
            state={data.state}
            coldMax={thresholds.coldMax}
            hotMin={thresholds.hotMin}
          />
          <p className={styles.value}>
            {data.temperature.toFixed(1)}
            <span className={styles.unit}>°C</span>
          </p>
          <StatusBadge state={data.state} />
          {/* Kept mounted with reserved height: HOT toggles its text rather than inserting a node,
              so the layout never shifts and the change is announced on a COLD/WARM -> HOT transition. */}
          <p role="alert" className={styles.alert}>
            {data.state === 'HOT' ? COPY.overheating : ''}
          </p>
          {/* On a failed poll the hook keeps the last reading; tell the user it is no longer live.
              Hidden from assistive tech while reconnecting, since the status region below announces
              it (otherwise the same text is both read here and announced there). */}
          <p className={styles.meta} aria-hidden={error ? true : undefined}>
            {error ? (
              COPY.reconnecting
            ) : (
              <>
                {COPY.updated}{' '}
                <time dateTime={data.capturedAt.toISOString()}>{formatTime(data.capturedAt)}</time>
              </>
            )}
          </p>
          {/* Announce the stale/reconnecting state to assistive tech. The visible meta above is
              not a live region, so the per-poll "Updated" tick never spams the screen reader. */}
          <p role="status" className={styles.srOnly}>
            {error ? COPY.reconnecting : ''}
          </p>
        </div>
      ) : isLoading ? (
        <p className={styles.state}>
          <Spinner /> {COPY.loading}
        </p>
      ) : (
        <div className={styles.state} role="alert">
          <p>{COPY.error}</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            {COPY.retry}
          </Button>
        </div>
      )}
    </Card>
  );
}
