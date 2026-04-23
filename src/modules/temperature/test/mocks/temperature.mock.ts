export interface UpdateThresholdsMock {
  coldBelowCelsius?: unknown;
  hotFromCelsius?: unknown;
  [key: string]: unknown;
}

export function createThresholdsMock(overrides: UpdateThresholdsMock = {}): UpdateThresholdsMock {
  return {
    coldBelowCelsius: 22,
    hotFromCelsius: 35,
    ...overrides,
  };
}
