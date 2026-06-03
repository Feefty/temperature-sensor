import { AppShell } from '@/components/AppShell';
import { Dashboard } from '@/dashboard';

export function App() {
  return (
    <AppShell title="Temperature Monitor">
      <Dashboard />
    </AppShell>
  );
}
