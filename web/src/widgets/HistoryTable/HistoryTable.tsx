import { useHistory } from '@/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import { COPY } from './scheme';
import styles from './HistoryTable.module.css';

export function HistoryTable() {
  const { data, error, isLoading, reload } = useHistory();

  return (
    <Card role="region" aria-labelledby="history-title">
      <div className={styles.header}>
        <h2 id="history-title" className={styles.title}>
          {COPY.title}
        </h2>
        <Button variant="secondary" isLoading={isLoading} onClick={() => void reload()}>
          {COPY.refresh}
        </Button>
      </div>

      {data ? (
        <>
          {/* Always-mounted live region so a later failed-refresh message is reliably announced;
              a failed refresh keeps the table rather than wiping the data. */}
          <p role="status" className={styles.refreshError}>
            {error ? COPY.refreshFailed : ''}
          </p>
          {data.length === 0 ? (
            <p className={styles.empty}>{COPY.empty}</p>
          ) : (
            <table className={styles.table}>
              <caption className={styles.caption}>{COPY.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{COPY.time}</th>
                  <th scope="col">{COPY.temperature}</th>
                  <th scope="col">{COPY.state}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((reading, index) => (
                  <tr key={`${reading.capturedAt.toISOString()}-${index}`}>
                    <td>
                      <time dateTime={reading.capturedAt.toISOString()}>
                        {reading.capturedAt.toLocaleTimeString()}
                      </time>
                    </td>
                    <td className={styles.temp}>{reading.temperature.toFixed(1)}°C</td>
                    <td>
                      <StatusBadge state={reading.state} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : isLoading ? (
        <p className={styles.state}>
          <Spinner /> {COPY.loading}
        </p>
      ) : (
        <p role="alert" className={styles.state}>
          {COPY.error}
        </p>
      )}
    </Card>
  );
}
