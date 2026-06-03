// The dashboard renders the SensorState the API assigns to each reading.
export type SensorState = 'COLD' | 'WARM' | 'HOT';

// Wire shape returned by the API (capturedAt is an ISO 8601 string).
export interface ReadingDto {
  temperature: number;
  state: SensorState;
  capturedAt: string;
}

// Domain shape the UI works with (capturedAt parsed to a Date).
export interface Reading {
  temperature: number;
  state: SensorState;
  capturedAt: Date;
}

export interface Thresholds {
  coldMax: number;
  hotMin: number;
}
