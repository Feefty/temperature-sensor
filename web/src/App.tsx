import { AppShell } from '@/components/AppShell';
import { LiveReading } from '@/widgets/LiveReading';

export function App() {
  return (
    <AppShell title="Temperature Monitor">
      <LiveReading />
    </AppShell>
  );
}
