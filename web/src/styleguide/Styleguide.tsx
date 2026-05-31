import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/StatusBadge';
import styles from './Styleguide.module.css';

export function Styleguide() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2>Buttons</h2>
        <div className={styles.row}>
          <Button>Apply</Button>
          <Button variant="secondary">Cancel</Button>
          <Button isLoading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Status</h2>
        <div className={styles.row}>
          <StatusBadge state="COLD" />
          <StatusBadge state="WARM" />
          <StatusBadge state="HOT" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Card</h2>
        <Card>
          <div className={styles.reading}>
            <StatusBadge state="WARM" />
            <span className={styles.value}>24.3°C</span>
          </div>
          <p>Glass surface over a blurred backdrop.</p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2>Spinner</h2>
        <div className={[styles.row, styles.spinners].join(' ')}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Fields</h2>
        <div className={styles.fields}>
          <Field label="Cold below" type="number" defaultValue={22} hint="Exclusive, in Celsius" />
          <Field label="Hot from" type="number" defaultValue={35} hint="Inclusive, in Celsius" />
          <Field label="Threshold" type="range" min={0} max={50} defaultValue={25} />
        </div>
      </section>
    </div>
  );
}
