
import {Record} from "../data/entity/temperature.record.entity";
import {SensorState, State} from "../data/entity/sensor.state.entity";
import temperatureRecordRepository from "../data/repository/temperatureRecordRepository";
import stateRepository from "../data/repository/stateRepository";
import temperatureThresholdRepository from "../data/repository/temperatureThresholdRepository";


export class TemperatureSensorHandler {
    private static instance: TemperatureSensorHandler;

    private constructor() {}

    static getInstance(): TemperatureSensorHandler {
        if (!TemperatureSensorHandler.instance) {
            TemperatureSensorHandler.instance = new TemperatureSensorHandler();
        }
        return TemperatureSensorHandler.instance;
    }
    getLastFifteenRecords =  () => {
            return temperatureRecordRepository.getLastFifteenRecords();
    }
    getState = async () => {
        return stateRepository.getState();
    }
    updateState = async( lastRecord: Record) => {
        const threshold = await temperatureThresholdRepository.getThreshold();
        if(threshold !== undefined){
            let state = await stateRepository.getState();
            if(state == null){
                state = new State()
            }
            const newState = lastRecord.temperature >= threshold.warmToHot ? SensorState.HOT : lastRecord.temperature >= threshold.coldToWarm ?SensorState.WARM : SensorState.COLD
            if(newState !== state.State){
                state.State = newState
                state = await state.save()
            }
            return state
        }
    }
    insertRecord = (temperature: number) => {
         return temperatureRecordRepository.insertRecord(temperature);
    }
}
const temperatureSensorHandler = TemperatureSensorHandler.getInstance();
export default temperatureSensorHandler;