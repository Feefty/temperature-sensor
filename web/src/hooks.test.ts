import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDelayedFlag, useMediaQuery } from './hooks';

describe('useMediaQuery', () => {
  it('reads the initial match and tracks later changes', () => {
    const listeners = new Set<() => void>();
    let matches = false;
    const original = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({
        get matches() {
          return matches;
        },
        media: query,
        onchange: null,
        addEventListener: (_event: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_event: string, cb: () => void) => listeners.delete(cb),
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    try {
      const { result } = renderHook(() => useMediaQuery('(min-width: 992px)'));
      expect(result.current).toBe(false);

      act(() => {
        matches = true;
        listeners.forEach((cb) => cb());
      });
      expect(result.current).toBe(true);
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('useDelayedFlag', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('never trips for an operation that finishes before the delay', () => {
    const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 200), {
      initialProps: { active: true },
    });
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(150));
    rerender({ active: false });
    act(() => vi.advanceTimersByTime(200));

    expect(result.current).toBe(false);
  });

  it('trips once the operation outlasts the delay, then clears', () => {
    const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 200), {
      initialProps: { active: true },
    });

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(true);

    rerender({ active: false });
    expect(result.current).toBe(false);
  });
});
