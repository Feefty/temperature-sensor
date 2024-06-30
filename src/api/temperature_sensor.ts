import {Router} from "express"
import {validateData} from "../middlewares/validationMiddleware";
import {recordInsertSchema} from "../schemas/temperatureSensorSchemas";
import {EntityNotFoundError} from "typeorm";
import logger from "../libs/logger";
import temperatureSensorHandler from "../handlers/temperatureSensorHandler";
const router = Router();

/* GET current state */
router.get('/state', async function(req, res, next) {
    try{
        const state = await  temperatureSensorHandler.getState()
        res.status(200).json(state.State)
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            res.status(404).send("State not found.");
            return;
        }
        logger.error(error);
        res.status(500).send({ message: "Error fetching sample" })
    }

});
/* GET last 15 temperature records. */
router.get('/', async function(req, res, next) {
    try{
        const records = await  temperatureSensorHandler.getLastFifteenRecords()
        res.status(200).json(records)
    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: "Error fetching records" })
    }
});

/* POST temperature record.
* Insert a new record then update the current state of the sensor
*/
router.post('/', validateData(recordInsertSchema), async function(req, res, next) {
    try{
        const record = await temperatureSensorHandler.insertRecord(req.body.temperature);
        await temperatureSensorHandler.updateState(record);
        res.status(200).json(record)
    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: "Error saving record" })
    }

});

export default router;
