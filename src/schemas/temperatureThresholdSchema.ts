import {z} from "zod";

export const thresholdInsertSchema = z.object({
    coldToWarm: z.number(),
    warmToHot: z.number()
}).refine(data => data.warmToHot > data.coldToWarm, {
    message : " the warmToHot value should be greater than coldToWarm value"
});