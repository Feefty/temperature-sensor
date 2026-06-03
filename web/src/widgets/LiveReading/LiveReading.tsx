import { useLiveReading } from '@/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Gauge } from '@/components/Gauge';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { COPY } from './scheme';
import styles from './LiveReading.module.css';

export interface LiveReadingProps {
  pollMs?: number;
}

export function LiveReading({ pollMs = 5000 }: LiveReadingProps) {
  const { data, error, isLoading, refetch } = useLiveReading(pollMs);

  return (
    <Card role="region" aria-labelledby="rack-sensor-title">
      <h2 id="rack-sensor-title" className={styles.title}>
        {COPY.title}
      </h2>

      {data ? (
        <div className={styles.reading}>
          <Gauge value={data.temperature} state={data.state} />
          <p className={styles.value}>
            {data.temperature.toFixed(1)}
            <span className={styles.unit}>°C</span>
          </p>
          <StatusBadge state={data.state} />
          {data.state === 'HOT' ? (
            <p role="alert" className={styles.alert}>
              {COPY.overheating}
            </p>
          ) : null}
          {/* On a failed poll the hook keeps the last reading; tell the user it is no longer live. */}
          <p className={styles.meta}>
            {error ? (
              COPY.reconnecting
            ) : (
              <>
                {COPY.updated}{' '}
                <time dateTime={data.capturedAt.toISOString()}>
                  {data.capturedAt.toLocaleTimeString()}
                </time>
              </>
            )}
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
