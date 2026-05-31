import { useState } from 'react';
import { Button } from '@/components/Button';

type Theme = 'dark' | 'light';

// The theme is resolved and applied to <html> before paint by the inline script in index.html;
// this control reads that initial value, then owns toggling it afterwards.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage blocked: keep the in-session choice without throwing.
    }
  };

  return (
    <Button variant="secondary" onClick={toggle}>
      {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </Button>
  );
}
