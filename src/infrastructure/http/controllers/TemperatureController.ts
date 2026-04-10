import { NextFunction, Request, Response } from "express";
import { GetTemperatureStateUseCase } from "../../../application/usecases/getTemperatureState.use-case";
import { UpdateThresholdUseCase } from "../../../application/usecases/updateThreshold.use-case";
import { SensorRepository } from "../../../domain/ports/Sensor.repository";
import { HistoryRepository } from "../../../domain/ports/History.repository";
import { SensorSchema } from "../../../domain/entities/Sensor";
import { GetHistoryUseCase } from "../../../application/usecases/getHistory.use-case";

export class TemperatureController {
    constructor(
        private readonly getTemperatureStateUseCase: GetTemperatureStateUseCase,
        private readonly updateThresholdUseCase: UpdateThresholdUseCase,
        private readonly getHistoryUseCase: GetHistoryUseCase,
        private readonly sensorRepository: SensorRepository,
        private readonly historyRepository: HistoryRepository,
    ) { }

    getTemperatureState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getTemperatureStateUseCase.execute();
            res.json(result);
        } catch (err) { next(err); }
    };

    getSensorConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const config = await this.sensorRepository.get();
            res.json(config);
        } catch (err) { next(err); }
    };

    updateSensorConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { maxTemperature, minTemperature } = SensorSchema.parse(req.body);
            await this.updateThresholdUseCase.execute(maxTemperature, minTemperature);
            res.status(200).json({ message: "Sensor updated successfully" });
        } catch (err) { next(err); }
    };

    getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const history = await this.getHistoryUseCase.execute()
            res.json(history);
        } catch (err) { next(err); }
    };
}
