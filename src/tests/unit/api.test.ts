import request from 'supertest';
import app from '../../app';
import temperatureSensorHandler from '../../handlers/temperatureSensorHandler';
import temperatureThresholdHandler from '../../handlers/temperatureThresholdHandler';
import { dataSource } from '../../data/data-source';
import {EntityNotFoundError} from "typeorm";
import {State} from "../../data/entity/sensor.state.entity";

jest.mock('../../handlers/temperatureSensorHandler');
jest.mock('../../handlers/temperatureThresholdHandler');
jest.mock('../../data/data-source', () => ({
    dataSource: {
        initialize: jest.fn().mockResolvedValue(true)
    },
}));

describe('Temperature Sensor API', () => {
    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/sensor/state', () => {
        it('should return the current state', async () => {
            const mockState = { State: 'WARM' };
            (temperatureSensorHandler.getState as jest.Mock).mockResolvedValue(mockState);

            const response = await request(app).get('/api/v1/sensor/state');

            expect(response.status).toBe(200);
            expect(response.body).toBe(mockState.State);
            expect(temperatureSensorHandler.getState).toHaveBeenCalledTimes(1);
        });

        it('should return 404 if state not found', async () => {
            (temperatureSensorHandler.getState as jest.Mock).mockRejectedValue(new EntityNotFoundError(State,"not found"));

            const response = await request(app).get('/api/v1/sensor/state');

            expect(response.status).toBe(404);
            expect(response.text).toBe('State not found.');
            expect(temperatureSensorHandler.getState).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/v1/sensor', () => {
        it('should return the last fifteen records', async () => {
            const mockRecords = [{ temperature: 20 }, { temperature: 25 }];
            (temperatureSensorHandler.getLastFifteenRecords as jest.Mock).mockResolvedValue(mockRecords);

            const response = await request(app).get('/api/v1/sensor');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecords);
            expect(temperatureSensorHandler.getLastFifteenRecords).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /api/v1/sensor', () => {
        it('should insert a new record and update state', async () => {
            const mockRecord = { temperature: 22 };
            (temperatureSensorHandler.insertRecord as jest.Mock).mockResolvedValue(mockRecord);
            (temperatureSensorHandler.updateState as jest.Mock).mockResolvedValue({ State: 'WARM' });

            const response = await request(app)
                .post('/api/v1/sensor')
                .send({ temperature: 22 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecord);
            expect(temperatureSensorHandler.insertRecord).toHaveBeenCalledWith(22);
            expect(temperatureSensorHandler.insertRecord).toHaveBeenCalledTimes(1);
            expect(temperatureSensorHandler.updateState).toHaveBeenCalledWith(mockRecord);
            expect(temperatureSensorHandler.updateState).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /api/v1/threshold', () => {
        it('should update the threshold and state', async () => {
            const mockThreshold = { coldToWarm: 10, warmToHot: 30 };
            (temperatureThresholdHandler.updateThreshold as jest.Mock).mockResolvedValue(mockThreshold);
            (temperatureThresholdHandler.updateState as jest.Mock).mockResolvedValue({ State: 'WARM' });

            const response = await request(app)
                .post('/api/v1/threshold')
                .send(mockThreshold);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockThreshold);
            expect(temperatureThresholdHandler.updateThreshold).toHaveBeenCalledWith(10, 30);
            expect(temperatureThresholdHandler.updateThreshold).toHaveBeenCalledTimes(1);
            expect(temperatureThresholdHandler.updateState).toHaveBeenCalledWith(mockThreshold);
            expect(temperatureThresholdHandler.updateState).toHaveBeenCalledTimes(1);
        });
    });
});
