import { AppShell } from '@/components/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Dashboard } from '@/dashboard';

export function App() {
  return (
    <AppShell title="Temperature Monitor">
      <ErrorBoundary
        fallback={
          <p role="alert">Something went wrong loading the dashboard. Please reload the page.</p>
        }
      >
        <Dashboard />
      </ErrorBoundary>
    </AppShell>
  );
}
