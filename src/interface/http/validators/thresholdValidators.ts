import { z } from 'zod';

export const updateThresholdsSchema = z.object({
  body: z
    .object({
      hotThreshold: z.number().min(-50).max(100).optional(),
      coldThreshold: z.number().min(-50).max(100).optional()
    })
    .refine(
      (data) => {
        if (data.hotThreshold !== undefined && data.coldThreshold !== undefined) {
          return data.hotThreshold > data.coldThreshold;
        }
        return true;
      },
      { message: 'hotThreshold must be greater than coldThreshold' }
    )
});
