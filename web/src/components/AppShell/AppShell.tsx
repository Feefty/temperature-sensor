import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './AppShell.module.css';

export interface AppShellProps {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.header}>
        <h1 className={styles.brand}>{title}</h1>
        <ThemeToggle />
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        {children}
      </main>
    </>
  );
}
