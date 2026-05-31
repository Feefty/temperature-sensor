// jest-axe ships no declarations, and @types/jest-axe pulls in @types/jest which
// collides with vitest/globals. This ambient declaration covers what we use.
declare module 'jest-axe' {
  export function axe(html: Element | string, options?: Record<string, unknown>): Promise<unknown>;
  export const toHaveNoViolations: {
    toHaveNoViolations(actual: unknown): { pass: boolean; message: () => string };
  };
}
