import { useEffect, useState } from 'react';

// Tracks a CSS media query so the layout can switch interaction models (tabbed on narrow
// screens, side-by-side on wide ones) rather than only restyling. Reads the match synchronously
// on mount to avoid a first-paint flash, then follows changes.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

// True only once `active` has stayed true for `delayMs`. A fast operation flips `active` off
// before the timer fires, so a spinner never flashes for waits too short to notice; slow ones
// still show it.
export function useDelayedFlag(active: boolean, delayMs = 200): boolean {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const id = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(id);
  }, [active, delayMs]);

  return shown;
}
