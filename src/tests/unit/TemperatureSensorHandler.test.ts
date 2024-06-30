import temperatureRecordRepository from "../../data/repository/temperatureRecordRepository";
import {Record} from "../../data/entity/temperature.record.entity";
import temperatureSensorHandler from "../../handlers/temperatureSensorHandler";
import {SensorState} from "../../data/entity/sensor.state.entity";
import stateRepository from "../../data/repository/stateRepository";
import temperatureThresholdRepository from "../../data/repository/temperatureThresholdRepository";

jest.mock('../../data/repository/temperatureRecordRepository');
jest.mock('../../data/repository/stateRepository');
jest.mock('../../data/repository/temperatureThresholdRepository');

describe('TemperatureSensorHandler Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the last fifteen records', async () => {
        const mockRecords = [{ temperature: 20 }, { temperature: 25 }] as Record[];
        (temperatureRecordRepository.getLastFifteenRecords as jest.Mock).mockResolvedValue(mockRecords);

        const records = await temperatureSensorHandler.getLastFifteenRecords();

        expect(records).toEqual(mockRecords);
        expect(temperatureRecordRepository.getLastFifteenRecords).toHaveBeenCalledTimes(1);
    });

    it('should return the current state', async () => {
        const mockState = { State: SensorState.WARM };
        (stateRepository.getState as jest.Mock).mockResolvedValue(mockState);

        const state = await temperatureSensorHandler.getState();

        expect(state).toEqual(mockState);
        expect(stateRepository.getState).toHaveBeenCalledTimes(1);
    });

    it('should update the state based on the last record', async () => {
        const mockThreshold = { warmToHot: 30, coldToWarm: 15 };
        const mockState = { State: SensorState.COLD, save: jest.fn().mockResolvedValue({ State: SensorState.WARM }) };
        const mockRecord = { temperature: 20 } as Record;

        (temperatureThresholdRepository.getThreshold as jest.Mock).mockResolvedValue(mockThreshold);
        (stateRepository.getState as jest.Mock).mockResolvedValue(mockState);

        const state = await temperatureSensorHandler.updateState(mockRecord);

        expect(state.State).toEqual(SensorState.WARM);
        expect(temperatureThresholdRepository.getThreshold).toHaveBeenCalledTimes(1);
        expect(stateRepository.getState).toHaveBeenCalledTimes(1);
        expect(mockState.save).toHaveBeenCalledTimes(1);
    });

    it('should insert a new record', async () => {
        const mockTemperature = 22;
        const mockRecord = { temperature: mockTemperature } as Record;

        (temperatureRecordRepository.insertRecord as jest.Mock).mockResolvedValue(mockRecord);

        const record = await temperatureSensorHandler.insertRecord(mockTemperature);

        expect(record).toEqual(mockRecord);
        expect(temperatureRecordRepository.insertRecord).toHaveBeenCalledWith(mockTemperature);
        expect(temperatureRecordRepository.insertRecord).toHaveBeenCalledTimes(1);
    });
});
