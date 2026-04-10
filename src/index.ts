import express from "express";
import { PrismaSensorRepository } from "./infrastructure/persistences/PrismaSensor.repository";
import { UpdateThresholdUseCaseImpl } from "./application/usecases/updateThreshold.use-case";
import { SensorSchema } from "./domain/entities/Sensor";
import { PrismaHistoryRepository } from "./infrastructure/persistences/PrismaHistory.repository";
import { GetHistoryUseCaseImpl } from "./application/usecases/getHistory.use-case";
import { GetTemperatureStateUseCaseImpl } from "./application/usecases/getTemperatureState.use-case";
import { FakeTemperatureSensor } from "./infrastructure/adapters/FakeTemperatureSensor";
import { prisma } from "./infrastructure/database/PrismaClient";

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/sensor", async (req, res) => {
    try {
        const { maxTemperature, minTemperature } = req.body;
        const sensor = SensorSchema.parse({ maxTemperature, minTemperature });
        const updateSensorUseCase = new UpdateThresholdUseCaseImpl(new PrismaSensorRepository(prisma));
        await updateSensorUseCase.execute(sensor);
        res.send("Sensor updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating sensor");
    }
})

app.get("/history", async (req, res) => {
    try {
        const historyRepository = new PrismaHistoryRepository(prisma);
        const getHistoryUseCase = new GetHistoryUseCaseImpl(historyRepository);
        const history = await getHistoryUseCase.execute();
        res.send(history);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting history");
    }
})

app.get("/", async (req, res) => {
    try {
        const sensorRepository = new PrismaSensorRepository(prisma);
        const temperatureSensorRepository = new FakeTemperatureSensor();
        const historyRepository = new PrismaHistoryRepository(prisma);
        const getStateUseCase = new GetTemperatureStateUseCaseImpl(sensorRepository, temperatureSensorRepository, historyRepository);
        const state = await getStateUseCase.execute();
        res.send(state);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting temperature");
    }
})



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});