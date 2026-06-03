import { HistoryTable } from '@/widgets/HistoryTable';
import { LiveReading } from '@/widgets/LiveReading';
import styles from './Dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.grid}>
      <LiveReading />
      <HistoryTable />
    </div>
  );
}
