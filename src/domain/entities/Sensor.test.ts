import { SensorEntity, StateSchema } from "./Sensor";
import { TemperatureSensor } from "./TemperatureSensor";

describe("SensorEntity", () => {
    describe("constructor", () => {
        it("should throw an error if minTemperature is greater than maxTemperature", () => {
            expect(() => new SensorEntity(18, 28)).toThrow("minTemperature must be less than maxTemperature");
        });

        it("should throw an error if minTemperature is equal to maxTemperature", () => {
            expect(() => new SensorEntity(25, 25)).toThrow("minTemperature must be less than maxTemperature");
        });

        it("should instantiate normally if valid", () => {
            expect(() => new SensorEntity(28, 18)).not.toThrow();
        });
    });

    describe("evaluate()", () => {
        const maxThreshold = 30;
        const minThreshold = 10;
        let sensorEntity: SensorEntity;

        beforeEach(() => {
            sensorEntity = new SensorEntity(maxThreshold, minThreshold);
        });

        it("should return HOT when temperature is greater than max temperature", () => {
            const temp: TemperatureSensor = { temperature: 35 };
            expect(sensorEntity.evaluate(temp)).toBe(StateSchema.enum.HOT);
        });

        it("should return HOT when temperature is equal to max temperature", () => {
            const temp: TemperatureSensor = { temperature: maxThreshold };
            expect(sensorEntity.evaluate(temp)).toBe(StateSchema.enum.HOT);
        });

        it("should return COLD when temperature is less than min temperature", () => {
            const temp: TemperatureSensor = { temperature: 5 };
            expect(sensorEntity.evaluate(temp)).toBe(StateSchema.enum.COLD);
        });

        it("should return WARM when temperature is equal to min temperature", () => {
            const temp: TemperatureSensor = { temperature: minThreshold };
            expect(sensorEntity.evaluate(temp)).toBe(StateSchema.enum.WARM);
        });

        it("should return WARM when temperature is between min and max temperatures", () => {
            const temp: TemperatureSensor = { temperature: 20 };
            expect(sensorEntity.evaluate(temp)).toBe(StateSchema.enum.WARM);
        });
    });
});
