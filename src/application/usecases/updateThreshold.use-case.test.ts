import { UpdateThresholdUseCaseImpl } from "./updateThreshold.use-case";
import { SensorRepository } from "../../domain/ports/Sensor.repository";

describe("UpdateThresholdUseCaseImpl", () => {
    let mockSensorRepository: jest.Mocked<SensorRepository>;
    let updateThresholdUseCase: UpdateThresholdUseCaseImpl;

    beforeEach(() => {
        mockSensorRepository = {
            save: jest.fn(),
            get: jest.fn(),
        };

        updateThresholdUseCase = new UpdateThresholdUseCaseImpl(mockSensorRepository);
    });

    it("should call save on the repository with correct sensor parameters", async () => {
        const payload = {
            maxTemperature: 28,
            minTemperature: 18,
        };

        await updateThresholdUseCase.execute(payload);

        expect(mockSensorRepository.save).toHaveBeenCalledTimes(1);
        expect(mockSensorRepository.save).toHaveBeenCalledWith(payload);
    });

});
