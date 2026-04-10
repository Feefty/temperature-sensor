import { z } from "zod";

export const TemperatureSensorSchema = z.object({
    temperature: z.number()
});

export type TemperatureSensor = z.infer<typeof TemperatureSensorSchema>;
