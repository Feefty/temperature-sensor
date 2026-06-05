import { Hono } from 'hono';
export const TemperatureSensorRoutes = (deps) => {
    const app = new Hono();
    app.get('/', async (c) => {
        const temperatureSensor = await deps.GetTemperatureSensor.execute();
        return c.json(temperatureSensor);
    });
    app.get('/last15', async (c) => {
        const temperatureStates = await deps.GetFifteenLastedTemperatureState.execute();
        return c.json(temperatureStates);
    });
    return app;
};
