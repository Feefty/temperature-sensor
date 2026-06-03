import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { useHistory, useLiveReading, useRedefineThresholds, useThresholds } from '@/api';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';
const READING = { temperature: 24.3, state: 'WARM', capturedAt: '2026-05-31T10:00:00.000Z' };

describe('useLiveReading', () => {
  it('starts loading then exposes the current reading', async () => {
    server.use(http.get(`${BASE}/temperature`, () => HttpResponse.json(READING)));

    const { result } = renderHook(() => useLiveReading());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data?.state).toBe('WARM'));
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('surfaces an error when the request fails', async () => {
    server.use(http.get(`${BASE}/temperature`, () => new HttpResponse(null, { status: 500 })));

    const { result } = renderHook(() => useLiveReading(100000));
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });

  it('keeps the newest reading when an older in-flight response resolves later', async () => {
    let call = 0;
    server.use(
      http.get(`${BASE}/temperature`, async () => {
        call += 1;
        if (call === 1) {
          await delay(50);
          return HttpResponse.json({ ...READING, temperature: 1 });
        }
        return HttpResponse.json({ ...READING, temperature: 99 });
      }),
    );

    const { result } = renderHook(() => useLiveReading(100000));
    // The mount poll (call 1) is slow; a manual refetch (call 2) is issued after it and resolves first.
    await act(async () => {
      void result.current.refetch();
      await delay(80);
    });

    expect(result.current.data?.temperature).toBe(99);
  });

  it('refetches once when refreshKey changes, without resetting the poll', async () => {
    let calls = 0;
    server.use(
      http.get(`${BASE}/temperature`, () => {
        calls += 1;
        return HttpResponse.json(READING);
      }),
    );

    const { result, rerender } = renderHook(({ key }) => useLiveReading(100000, key), {
      initialProps: { key: 0 },
    });
    await waitFor(() => expect(result.current.data?.state).toBe('WARM'));
    const afterMount = calls;

    rerender({ key: 1 });
    await waitFor(() => expect(calls).toBe(afterMount + 1));
  });

  it('keeps the last good reading when a later poll fails', async () => {
    server.use(http.get(`${BASE}/temperature`, () => HttpResponse.json(READING)));
    const { result } = renderHook(() => useLiveReading(100000));
    await waitFor(() => expect(result.current.data?.state).toBe('WARM'));

    server.use(http.get(`${BASE}/temperature`, () => new HttpResponse(null, { status: 500 })));
    await act(() => result.current.refetch());

    expect(result.current.data?.state).toBe('WARM');
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useHistory', () => {
  it('loads the history and can reload it', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json([READING])));

    const { result } = renderHook(() => useHistory());
    await waitFor(() => expect(result.current.data).toHaveLength(1));

    await act(() => result.current.reload());
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('surfaces an error when the history fails to load', async () => {
    server.use(
      http.get(`${BASE}/temperature/history`, () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useHistory());
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});

describe('useThresholds', () => {
  it('loads the current thresholds from the server', async () => {
    server.use(
      http.get(`${BASE}/thresholds`, () => HttpResponse.json({ coldMax: 18, hotMin: 30 })),
    );

    const { result } = renderHook(() => useThresholds());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data).toEqual({ coldMax: 18, hotMin: 30 }));
    expect(result.current.error).toBeNull();
  });

  it('surfaces an error when the thresholds fail to load', async () => {
    server.use(http.get(`${BASE}/thresholds`, () => new HttpResponse(null, { status: 500 })));

    const { result } = renderHook(() => useThresholds());
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});

describe('useRedefineThresholds', () => {
  it('saves thresholds and clears the saving flag', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    );

    const { result } = renderHook(() => useRedefineThresholds());
    let saved;
    await act(async () => {
      saved = await result.current.redefine({ coldMax: 10, hotMin: 20 });
    });

    expect(saved).toEqual({ coldMax: 10, hotMin: 20 });
    expect(result.current.isSaving).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('records and rethrows a rejected save', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, () =>
        HttpResponse.json({ error: 'invalid' }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useRedefineThresholds());
    await act(async () => {
      await expect(result.current.redefine({ coldMax: 30, hotMin: 30 })).rejects.toBeInstanceOf(
        Error,
      );
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});
