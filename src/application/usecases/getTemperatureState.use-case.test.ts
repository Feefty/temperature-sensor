import { GetTemperatureStateUseCaseImpl } from "./getTemperatureState.use-case";
import { SensorEntity } from "../../domain/entities/Sensor";
import { SensorRepository } from "../../domain/ports/Sensor.repository";
import { TemperatureSensorRepository } from "../../domain/ports/TemperatureSensor.repository";
import { HistoryRepository } from "../../domain/ports/History.repository";

describe("GetStateUseCaseImpl", () => {
    let mockSensorRepository: jest.Mocked<SensorRepository>;
    let mockTemperatureSensorRepository: jest.Mocked<TemperatureSensorRepository>;
    let mockHistoryRepository: jest.Mocked<HistoryRepository>;

    let getTemperatureStateUseCase: GetTemperatureStateUseCaseImpl;

    beforeEach(() => {
        mockSensorRepository = {
            save: jest.fn(),
            get: jest.fn(),
        };

        mockTemperatureSensorRepository = {
            get: jest.fn(),
        };

        mockHistoryRepository = {
            save: jest.fn(),
            getMany: jest.fn(),
        };

        getTemperatureStateUseCase = new GetTemperatureStateUseCaseImpl(
            mockSensorRepository,
            mockTemperatureSensorRepository,
            mockHistoryRepository
        );
    });

    it("should return HOT when temperature is above max threshold", async () => {
        mockTemperatureSensorRepository.get.mockResolvedValue({ temperature: 30 });
        mockSensorRepository.get.mockResolvedValue(new SensorEntity(25, 15));

        const result = await getTemperatureStateUseCase.execute();

        expect(result.state).toBe("HOT");
        expect(result.temperature).toBe(30);
        expect(mockHistoryRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            temperature: 30,
            state: "HOT"
        }));
    });

    it("should return COLD when temperature is below min threshold", async () => {
        mockTemperatureSensorRepository.get.mockResolvedValue({ temperature: 10 });
        mockSensorRepository.get.mockResolvedValue(new SensorEntity(25, 15));

        const result = await getTemperatureStateUseCase.execute();

        expect(result.state).toBe("COLD");
        expect(result.temperature).toBe(10);
        expect(mockHistoryRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            temperature: 10,
            state: "COLD"
        }));
    });

    it("should return WARM when temperature is within boundaries", async () => {
        mockTemperatureSensorRepository.get.mockResolvedValue({ temperature: 20 });
        mockSensorRepository.get.mockResolvedValue(new SensorEntity(25, 15));

        const result = await getTemperatureStateUseCase.execute();

        expect(result.state).toBe("WARM");
        expect(result.temperature).toBe(20);
        expect(mockHistoryRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            temperature: 20,
            state: "WARM"
        }));
    });
});
