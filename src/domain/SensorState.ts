export const SENSOR_STATES = ["HOT", "COLD", "WARM"] as const;
export type SensorState = (typeof SENSOR_STATES)[number];
