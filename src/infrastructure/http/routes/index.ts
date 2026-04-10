import { Router } from "express";
import { TemperatureControllerFactory } from "../../factories/temperatureControllerFactory";
import { temperatureRouteBuilder } from "./temperature.route";


export const router = Router();

router.use("/temperature", temperatureRouteBuilder(TemperatureControllerFactory()));