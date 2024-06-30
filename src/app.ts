import express from "express"
import morgan from 'morgan';
import cors from 'cors';
import api from './api';
import {dataSource} from "./data/data-source";
import logger from "./libs/logger";
import "./env"

dataSource
    .initialize()
    .then(() => {
      logger.info("Data Source has been initialized!")
    })
    .catch((err) => {
      logger.error("Error during Data Source initialization:", err)
        throw err;
    })


const app = express()
app.use(express.json())
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/api/v1', api);

export default app;
