import { useCallback, useEffect, useRef, useState } from 'react';
import type { Reading, Thresholds } from '@/types';
import { api } from './client';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

// Polls the live temperature on an interval, and exposes refetch() for an immediate refresh
// (e.g. after the thresholds change). A failed poll keeps the last good reading alongside the
// error. A monotonic ticket guards against out-of-order responses and updates after unmount:
// only the most recently issued request may commit.
export function useLiveReading(intervalMs = 5000) {
  const [state, setState] = useState<AsyncState<Reading>>({
    data: null,
    error: null,
    isLoading: true,
  });
  const latest = useRef(0);

  const refetch = useCallback(async () => {
    const ticket = (latest.current += 1);
    try {
      const reading = await api.getTemperature();
      if (ticket === latest.current) setState({ data: reading, error: null, isLoading: false });
    } catch (error) {
      if (ticket === latest.current) {
        setState((prev) => ({ ...prev, error: error as Error, isLoading: false }));
      }
    }
  }, []);

  useEffect(() => {
    void refetch();
    const id = setInterval(() => void refetch(), intervalMs);
    return () => {
      clearInterval(id);
      // Invalidate any in-flight request so a late response cannot update an unmounted component.
      latest.current += 1;
    };
  }, [intervalMs, refetch]);

  return { ...state, refetch };
}

export function useHistory() {
  const [state, setState] = useState<AsyncState<Reading[]>>({
    data: null,
    error: null,
    isLoading: true,
  });
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const ticket = (latest.current += 1);
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const history = await api.getHistory();
      if (ticket === latest.current) setState({ data: history, error: null, isLoading: false });
    } catch (error) {
      if (ticket === latest.current) {
        setState((prev) => ({ ...prev, error: error as Error, isLoading: false }));
      }
    }
  }, []);

  useEffect(() => {
    void reload();
    return () => {
      latest.current += 1;
    };
  }, [reload]);

  return { ...state, reload };
}

export function useRedefineThresholds() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redefine = useCallback(async (input: Thresholds): Promise<Thresholds> => {
    setIsSaving(true);
    setError(null);
    try {
      return await api.redefineThresholds(input);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { redefine, isSaving, error };
}
