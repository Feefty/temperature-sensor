export const SensorState = {
  HOT: "HOT",
  COLD: "COLD",
  WARM: "WARM",
} as const;

export type SensorState = (typeof SensorState)[keyof typeof SensorState];
