import { z } from "zod/v4";

export const updateThresholdSchema = z
  .object({
    coldMax: z.number({ error: "coldMax is required and must be a number" }),
    hotMin: z.number({ error: "hotMin is required and must be a number" }),
  })
  .refine((data) => data.coldMax < data.hotMin, {
    message: "coldMax must be less than hotMin",
    path: ["coldMax"],
  });

export type UpdateThresholdDto = z.infer<typeof updateThresholdSchema>;
