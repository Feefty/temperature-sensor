import { TemperatureState } from './TemperatureState.js';

export class Temperature {
  constructor(
    public readonly id: string,
    public readonly value: number,
    public readonly state: TemperatureState,
    public readonly timestamp: Date
  ) {}

  static create(
    id: string,
    value: number,
    state: TemperatureState,
    timestamp: Date = new Date()
  ): Temperature {
    return new Temperature(id, value, state, timestamp);
  }
}
