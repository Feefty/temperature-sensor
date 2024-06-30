import { DataSource } from "typeorm"
import {TemperatureThreshold} from "./entity/temperature.threshold.entity";
import {State} from "./entity/sensor.state.entity";
import {Record} from "./entity/temperature.record.entity";

export const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Record,State,TemperatureThreshold],
    logging: true,
    synchronize: true,
})