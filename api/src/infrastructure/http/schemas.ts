import { z } from 'zod';

// Structural validation only (shape + finite numbers). The cold < hot business rule
// lives in the domain (createThresholds) and maps to 422, not 400.
export const thresholdsSchema = z.object({
  coldMax: z.number().finite(),
  hotMin: z.number().finite(),
});

export type ThresholdsRequest = z.infer<typeof thresholdsSchema>;
