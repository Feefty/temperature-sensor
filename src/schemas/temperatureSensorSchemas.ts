import {z} from "zod";

export const recordInsertSchema = z.object({
    temperature: z.number()
});