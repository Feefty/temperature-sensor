import { UpdateThresholdUseCaseImpl } from "./updateThreshold.use-case";
import { SensorRepository } from "../../domain/ports/Sensor.repository";

describe("UpdateThresholdUseCaseImpl", () => {
    let mockSensorRepository: jest.Mocked<SensorRepository>;
    let updateThresholdUseCase: UpdateThresholdUseCaseImpl;

    beforeEach(() => {
        mockSensorRepository = {
            get: jest.fn(),
            save: jest.fn().mockResolvedValue(undefined),
        };
        updateThresholdUseCase = new UpdateThresholdUseCaseImpl(mockSensorRepository);
    });

    describe("execute()", () => {
        it("should save the sensor with valid thresholds", async () => {
            await updateThresholdUseCase.execute(35, 22);

            expect(mockSensorRepository.save).toHaveBeenCalledTimes(1);
            expect(mockSensorRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ maxTemperature: 35, minTemperature: 22 })
            );
        });

        it("should throw when minTemperature is greater than maxTemperature", async () => {
            await expect(updateThresholdUseCase.execute(10, 30)).rejects.toThrow(
                "minTemperature must be less than maxTemperature"
            );
            expect(mockSensorRepository.save).not.toHaveBeenCalled();
        });

        it("should throw when minTemperature equals maxTemperature", async () => {
            await expect(updateThresholdUseCase.execute(25, 25)).rejects.toThrow(
                "minTemperature must be less than maxTemperature"
            );
            expect(mockSensorRepository.save).not.toHaveBeenCalled();
        });

        it("should work with negative temperature thresholds", async () => {
            await updateThresholdUseCase.execute(0, -10);

            expect(mockSensorRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ maxTemperature: 0, minTemperature: -10 })
            );
        });

        it("should propagate repository errors", async () => {
            mockSensorRepository.save.mockRejectedValue(new Error("DB connection failed"));

            await expect(updateThresholdUseCase.execute(35, 22)).rejects.toThrow("DB connection failed");
        });
    });
});
