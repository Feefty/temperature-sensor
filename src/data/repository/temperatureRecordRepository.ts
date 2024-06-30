import { dataSource } from "../data-source";
import { Record } from "../entity/temperature.record.entity";

export class TemperatureRecordRepository {
    private static instance: TemperatureRecordRepository;

    private constructor() {}

    static getInstance(): TemperatureRecordRepository {
        if (!TemperatureRecordRepository.instance) {
            TemperatureRecordRepository.instance = new TemperatureRecordRepository();
        }
        return TemperatureRecordRepository.instance;
    }

    async getLastFifteenRecords() {
        return dataSource.getRepository(Record)
            .createQueryBuilder("record")
            .orderBy("record.created_at", "DESC")
            .limit(15)
            .getMany();
    }

    async getLastRecord() {
        return dataSource.getRepository(Record)
            .createQueryBuilder("record")
            .orderBy("record.created_at", "DESC")
            .getOne();
    }

    async insertRecord(temperature: number) {
        const newRecord = new Record();
        newRecord.temperature = temperature;
        return dataSource.getRepository(Record).save(newRecord);
    }
}

const temperatureRecordRepository = TemperatureRecordRepository.getInstance();
export default temperatureRecordRepository;
