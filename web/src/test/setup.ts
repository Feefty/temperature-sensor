import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './server';

expect.extend(toHaveNoViolations);

// jsdom ships no matchMedia. Default to the wide layout so the dashboard renders its three
// regions together; tests that need the narrow (tabbed) layout override window.matchMedia.
window.matchMedia ??= (query: string) =>
  ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

// Any request without a matching handler fails the test, so no call goes unmocked.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
