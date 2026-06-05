import { TemperatureSensorRoutes } from './TemperatureSensor.routes.js';
describe('TemperatureSensor routes', () => {
    it('returns the current temperature state from GET /', async () => {
        const getTemperatureSensor = { execute: jest.fn().mockResolvedValue({ value: 18, state: 'cold' }) };
        const getFifteenLastedTemperatureState = { execute: jest.fn().mockResolvedValue([]) };
        const app = TemperatureSensorRoutes({
            GetTemperatureSensor: getTemperatureSensor,
            GetFifteenLastedTemperatureState: getFifteenLastedTemperatureState,
        });
        const response = await app.request('http://localhost/');
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ value: 18, state: 'cold' });
        expect(getTemperatureSensor.execute).toHaveBeenCalledTimes(1);
    });
    it('returns the last 15 temperature states from GET /last15', async () => {
        const getTemperatureSensor = { execute: jest.fn() };
        const getFifteenLastedTemperatureState = {
            execute: jest.fn().mockResolvedValue([{ id: '1', value: 25, state: 'warm', created_at: null }]),
        };
        const app = TemperatureSensorRoutes({
            GetTemperatureSensor: getTemperatureSensor,
            GetFifteenLastedTemperatureState: getFifteenLastedTemperatureState,
        });
        const response = await app.request('http://localhost/last15');
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual([
            { id: '1', value: 25, state: 'warm', created_at: null },
        ]);
        expect(getFifteenLastedTemperatureState.execute).toHaveBeenCalledTimes(1);
    });
});
