import type { Reading, SensorState, Thresholds } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';
const STATES: readonly string[] = ['COLD', 'WARM', 'HOT'];

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // No JSON body; fall back to a status-based message.
  }
  return `Request failed with status ${response.status}`;
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status);
  }
  return response.json();
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// The API is ours but not infallible: validate at the boundary so a malformed payload surfaces as
// a clean error instead of an Invalid Date or an out-of-range state slipping into the UI. Parse
// errors use status 0 (no HTTP response is at fault) and flow through the hooks' error state.
function parseReading(value: unknown): Reading {
  if (
    !isRecord(value) ||
    typeof value.temperature !== 'number' ||
    !Number.isFinite(value.temperature) ||
    typeof value.state !== 'string' ||
    !STATES.includes(value.state) ||
    typeof value.capturedAt !== 'string'
  ) {
    throw new ApiError('Malformed reading from the API', 0);
  }
  const capturedAt = new Date(value.capturedAt);
  if (Number.isNaN(capturedAt.getTime())) {
    throw new ApiError('Malformed timestamp from the API', 0);
  }
  return { temperature: value.temperature, state: value.state as SensorState, capturedAt };
}

function parseReadings(value: unknown): Reading[] {
  if (!Array.isArray(value)) throw new ApiError('Malformed history from the API', 0);
  return value.map(parseReading);
}

function parseThresholds(value: unknown): Thresholds {
  if (
    !isRecord(value) ||
    typeof value.coldMax !== 'number' ||
    !Number.isFinite(value.coldMax) ||
    typeof value.hotMin !== 'number' ||
    !Number.isFinite(value.hotMin)
  ) {
    throw new ApiError('Malformed thresholds from the API', 0);
  }
  return { coldMax: value.coldMax, hotMin: value.hotMin };
}

export const api = {
  getTemperature: () => request('/temperature').then(parseReading),
  getHistory: () => request('/temperature/history').then(parseReadings),
  getThresholds: () => request('/thresholds').then(parseThresholds),
  redefineThresholds: (input: Thresholds) =>
    request('/thresholds', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(parseThresholds),
};
