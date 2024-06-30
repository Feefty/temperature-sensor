import stateRepository  from "../data/repository/stateRepository";
import {SensorState, State} from "../data/entity/sensor.state.entity";
import { TemperatureThreshold } from "../data/entity/temperature.threshold.entity";
import temperatureRecordRepository from "../data/repository/temperatureRecordRepository";
import temperatureThresholdRepository from "../data/repository/temperatureThresholdRepository";

export class TemperatureThresholdHandler {
    private static instance: TemperatureThresholdHandler;

    private constructor() {}

    static getInstance(): TemperatureThresholdHandler {
        if (!TemperatureThresholdHandler.instance) {
            TemperatureThresholdHandler.instance = new TemperatureThresholdHandler();
        }
        return TemperatureThresholdHandler.instance;
    }

    updateThreshold = (coldToWarm: number, warmToHot: number) => {
        return temperatureThresholdRepository.insertThreshold(coldToWarm, warmToHot);
    }

    updateState = async (newThreshold: TemperatureThreshold) => {
        const lastRecord = await temperatureRecordRepository.getLastRecord();
        if(lastRecord !== null) {
            let state = await stateRepository.getState();
            if(state == null){
                state = new State()
            }
            const newState = lastRecord.temperature >= newThreshold.warmToHot ? SensorState.HOT : lastRecord.temperature >= newThreshold.coldToWarm ? SensorState.WARM : SensorState.COLD;
            if (newState !== state.State) {
                state.State = newState;
                await state.save();
            }
            return state;
        }
    }
}

// Usage example
const temperatureThresholdHandler = TemperatureThresholdHandler.getInstance();
export default temperatureThresholdHandler;
