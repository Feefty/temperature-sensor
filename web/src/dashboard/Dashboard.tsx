import { useId, useState } from 'react';
import { useThresholds } from '@/api';
import { Segmented } from '@/components/Segmented';
import { DEFAULT_THRESHOLDS } from '@/domain';
import { useMediaQuery } from '@/hooks';
import type { Thresholds } from '@/types';
import { HistoryTable } from '@/widgets/HistoryTable';
import { LiveReading } from '@/widgets/LiveReading';
import { ThresholdSettings } from '@/widgets/ThresholdSettings';
import styles from './Dashboard.module.css';

// Matches the Harvest "lg" breakpoint where the three regions stop competing for width.
const WIDE = '(min-width: 992px)';

export function Dashboard() {
  const { data: serverThresholds } = useThresholds();
  const [saved, setSaved] = useState<Thresholds | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const wide = useMediaQuery(WIDE);
  const [active, setActive] = useState('monitor');
  const baseId = useId();

  // The latest save wins, then the server's value, then the seed shown until the GET resolves.
  const thresholds = saved ?? serverThresholds ?? DEFAULT_THRESHOLDS;

  // New thresholds re-classify future readings, so reload the history and retint the gauge.
  const handleSaved = (next: Thresholds) => {
    setSaved(next);
    setRefreshKey((key) => key + 1);
  };

  const views = [
    {
      id: 'monitor',
      label: 'Monitor',
      node: <LiveReading thresholds={thresholds} refreshKey={refreshKey} />,
    },
    { id: 'history', label: 'History', node: <HistoryTable refreshKey={refreshKey} /> },
    { id: 'settings', label: 'Settings', node: <ThresholdSettings onSaved={handleSaved} /> },
  ];

  // Narrow screens get tabs (one focused view); wide screens show every region at once. Either
  // way the panels are rendered once at stable positions, so switching layouts on resize never
  // remounts a widget or restarts its polling.
  const panelProps = (id: string) =>
    wide
      ? {}
      : {
          role: 'tabpanel' as const,
          id: `${baseId}-panel-${id}`,
          'aria-labelledby': `${baseId}-tab-${id}`,
          hidden: id !== active,
        };

  return (
    <div className={wide ? styles.grid : styles.stack}>
      {!wide && (
        <Segmented
          label="Dashboard views"
          baseId={baseId}
          active={active}
          onChange={setActive}
          items={views.map(({ id, label }) => ({ id, label }))}
        />
      )}
      {views.map((view) => (
        <div key={view.id} className={styles[view.id]} {...panelProps(view.id)}>
          {view.node}
        </div>
      ))}
    </div>
  );
}
