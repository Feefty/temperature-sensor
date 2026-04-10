import { Router } from "express";
import { temperatureRouter } from "./temperature.route";

export const router = Router();

router.use("/temperature", temperatureRouter);