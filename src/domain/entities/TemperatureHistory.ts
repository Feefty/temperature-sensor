import { z } from "zod";
import { TemperatureSensorSchema } from "./TemperatureSensor";
import { StateSchema } from "./Sensor";

export const TemperatureHistorySchema = TemperatureSensorSchema.extend({
    state: StateSchema,
    timestamp: z.date(),
})


export type TemperatureHistory = z.infer<typeof TemperatureHistorySchema>;

