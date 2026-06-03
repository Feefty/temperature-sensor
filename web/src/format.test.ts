import { describe, expect, it } from 'vitest';
import { formatTime } from './format';

describe('formatTime', () => {
  it('renders a zero-padded 24-hour clock', () => {
    // Asserts the shape rather than an exact value so the test is timezone-independent.
    expect(formatTime(new Date('2026-05-31T09:05:07.000Z'))).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('renders midnight as 00, not 24', () => {
    // Local-time midnight in whatever timezone the runtime uses, so h23 (00) vs h24 (24) is the
    // only thing under test. A regression to hour12:false could surface 24:xx here.
    expect(formatTime(new Date(2026, 0, 1, 0, 0, 0))).toMatch(/^00:/);
  });
});
