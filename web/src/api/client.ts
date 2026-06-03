import type { Reading, ReadingDto, Thresholds } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status);
  }
  return (await response.json()) as T;
}

const toReading = (dto: ReadingDto): Reading => ({
  temperature: dto.temperature,
  state: dto.state,
  capturedAt: new Date(dto.capturedAt),
});

export const api = {
  getTemperature: () => request<ReadingDto>('/temperature').then(toReading),
  getHistory: () =>
    request<ReadingDto[]>('/temperature/history').then((dtos) => dtos.map(toReading)),
  redefineThresholds: (input: Thresholds) =>
    request<Thresholds>('/thresholds', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
};
