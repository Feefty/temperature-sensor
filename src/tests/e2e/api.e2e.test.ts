import {dataSource} from "../../data/data-source";
import 'dotenv/config'
jest.setTimeout(70000)
const baseUrl = `http://localhost:${process.env.APP_PORT}/api/v1`;

describe('Temperature Sensor API E2E', () => {
    beforeAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
    });
    afterAll(async () => {
        const entities = dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity.name);
            await repository.clear();
        }
    });

    describe('GET /state', () => {
        it('should return 404 if state not found', async () => {
            const response = await fetch(`${baseUrl}/sensor/state`);
            expect(response.status).toBe(404);
            const text = await response.text();
            expect(text).toBe('State not found.');
        });
    });

    describe('GET /', () => {
        it('should return the last fifteen records', async () => {
            const response = await fetch(`${baseUrl}/sensor`);
            expect(response.status).toBe(200);
            const records = await response.json();
            expect(records).toEqual([]);
        });
    });

    describe('POST /threshold and POST /', () => {
        it('should post a new threshold, insert a new record, and then update the threshold', async () => {
            // Post the initial threshold
            const initialThreshold = { coldToWarm: 10, warmToHot: 30 };
            const thresholdResponse1 = await fetch(`${baseUrl}/threshold`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(initialThreshold),
            });

            expect(thresholdResponse1.status).toBe(200);
            const threshold1 = await thresholdResponse1.json();
            expect(threshold1).toHaveProperty('coldToWarm', 10);
            expect(threshold1).toHaveProperty('warmToHot', 30);

            // Insert a new temperature record
            const temperatureResponse = await fetch(`${baseUrl}/sensor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ temperature: 22 }),
            });

            expect(temperatureResponse.status).toBe(200);
            const record = await temperatureResponse.json();
            expect(record).toHaveProperty('temperature', 22);

            // Check the state after inserting the record
            const stateResponse1 = await fetch(`${baseUrl}/sensor/state`);
            expect(stateResponse1.status).toBe(200);
            const state1 = await stateResponse1.json();
            expect(state1).toBe('WARM');

            // Update the threshold again
            const updatedThreshold = { coldToWarm: 12, warmToHot: 20 };
            const thresholdResponse2 = await fetch(`${baseUrl}/threshold`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedThreshold),
            });

            expect(thresholdResponse2.status).toBe(200);
            const threshold2 = await thresholdResponse2.json();
            expect(threshold2).toHaveProperty('coldToWarm', 12);
            expect(threshold2).toHaveProperty('warmToHot', 20);

            // Check the state after updating the threshold
            const stateResponse2 = await fetch(`${baseUrl}/sensor/state`);
            expect(stateResponse2.status).toBe(200);
            const state2 = await stateResponse2.json();
            expect(state2).toBe('HOT');
        });
    });
});
