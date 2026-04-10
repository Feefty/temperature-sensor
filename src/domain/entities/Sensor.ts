import { z } from "zod";
import { TemperatureSensor } from "./TemperatureSensor";

export const SensorSchema = z.object({
    maxTemperature: z.number(),
    minTemperature: z.number()
}).refine(data => data.minTemperature < data.maxTemperature, {
    message: "minTemperature must be less than maxTemperature",
    path: ["minTemperature"]
});

export const StateSchema = z.enum(["HOT", "COLD", "WARM"]);

export type State = z.infer<typeof StateSchema>;

export type Sensor = z.infer<typeof SensorSchema>;

export class SensorEntity implements Sensor {
    maxTemperature: number;
    minTemperature: number;

    constructor(maxTemperature: number, minTemperature: number) {
        if (minTemperature >= maxTemperature) {
            throw new Error("minTemperature must be less than maxTemperature");
        }
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
    }

    public evaluate(temperature: TemperatureSensor): State {
        if (temperature.temperature >= this.maxTemperature) {
            return StateSchema.enum.HOT;
        }
        if (temperature.temperature < this.minTemperature) {
            return StateSchema.enum.COLD;
        }
        return StateSchema.enum.WARM;
    }
}