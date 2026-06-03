import type { Thresholds } from '@/types';

// The sensor's operating range in degrees Celsius. The gauge scale and the threshold input
// bounds both derive from it, so the dial and the form stay in sync.
export const SENSOR_MIN = -10;
export const SENSOR_MAX = 50;

// Seed the gauge and the form until GET /thresholds resolves. These match the API's own defaults,
// so the dial reads correctly on first paint even before the request returns.
export const DEFAULT_THRESHOLDS: Thresholds = { coldMax: 22, hotMin: 35 };
