import {TemperatureThreshold} from "../../data/entity/temperature.threshold.entity";
import temperatureThresholdRepository from "../../data/repository/temperatureThresholdRepository";
import temperatureThresholdHandler from "../../handlers/temperatureThresholdHandler";
import {SensorState} from "../../data/entity/sensor.state.entity";
import temperatureRecordRepository from "../../data/repository/temperatureRecordRepository";
import stateRepository from "../../data/repository/stateRepository";

jest.mock('../../data/repository/temperatureRecordRepository');
jest.mock('../../data/repository/stateRepository');
jest.mock('../../data/repository/temperatureThresholdRepository');

describe('TemperatureThresholdHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the temperature threshold', async () => {
        const mockColdToWarm = 10;
        const mockWarmToHot = 30;
        const mockThreshold = new TemperatureThreshold();
        mockThreshold.coldToWarm = mockColdToWarm;
        mockThreshold.warmToHot = mockWarmToHot;

        (temperatureThresholdRepository.insertThreshold as jest.Mock).mockResolvedValue(mockThreshold);

        const threshold = await temperatureThresholdHandler.updateThreshold(mockColdToWarm, mockWarmToHot);

        expect(threshold).toEqual(mockThreshold);
        expect(temperatureThresholdRepository.insertThreshold).toHaveBeenCalledWith(mockColdToWarm, mockWarmToHot);
        expect(temperatureThresholdRepository.insertThreshold).toHaveBeenCalledTimes(1);
    });

    it('should update the state based on the new threshold', async () => {
        const mockThreshold = new TemperatureThreshold();
        mockThreshold.coldToWarm = 15;
        mockThreshold.warmToHot = 30;

        const mockRecord = { temperature: 20 };
        const mockState = { State: SensorState.COLD, save: jest.fn().mockResolvedValue({ State: SensorState.WARM }) };

        (temperatureRecordRepository.getLastRecord as jest.Mock).mockResolvedValue(mockRecord);
        (stateRepository.getState as jest.Mock).mockResolvedValue(mockState);

        const state = await temperatureThresholdHandler.updateState(mockThreshold);

        expect(state.State).toEqual(SensorState.WARM);
        expect(temperatureRecordRepository.getLastRecord).toHaveBeenCalledTimes(1);
        expect(stateRepository.getState).toHaveBeenCalledTimes(1);
        expect(mockState.save).toHaveBeenCalledTimes(1);
    });
});
