import { dataSource } from "../data-source";
import { TemperatureThreshold } from "../entity/temperature.threshold.entity";
import {IsNull, Not} from "typeorm";

export class TemperatureThresholdRepository {
    private static instance: TemperatureThresholdRepository;

    private constructor() {}

     static getInstance(): TemperatureThresholdRepository {
        if (!TemperatureThresholdRepository.instance) {
            TemperatureThresholdRepository.instance = new TemperatureThresholdRepository();
        }
        return TemperatureThresholdRepository.instance;
    }

     insertThreshold = async (coldToWarm: number, warmToHot: number) => {
        let threshold = await dataSource.manager.getRepository(TemperatureThreshold).findOne({where:{id: Not(IsNull())}});
        if (threshold == null) {
            threshold = new TemperatureThreshold();
        }
        threshold.coldToWarm = coldToWarm;
        threshold.warmToHot = warmToHot;
        return threshold.save();
    }

    getThreshold = () => {
        return dataSource.manager.getRepository(TemperatureThreshold).findOne({where:{id: Not(IsNull())}});
    }
}

const temperatureThresholdRepository = TemperatureThresholdRepository.getInstance();
export default temperatureThresholdRepository;
