import { Hono } from 'hono';
export const ThresholdsRoutes = (deps) => {
    const app = new Hono();
    app.get('/', async (c) => {
        const thresholds = await deps.GetThresholds.execute();
        return c.json(thresholds);
    });
    app.post('/cold', async (c) => {
        const { value } = await c.req.json();
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return c.json({ error: 'value must be a number' }, 400);
        }
        await deps.PostThresholds.executeCold(value);
        return c.json({ ok: true });
    });
    app.post('/hot', async (c) => {
        const { value } = await c.req.json();
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return c.json({ error: 'value must be a number' }, 400);
        }
        await deps.PostThresholds.executeHot(value);
        return c.json({ ok: true });
    });
    return app;
};
