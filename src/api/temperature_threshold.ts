import {Router} from "express"
import {validateData} from "../middlewares/validationMiddleware";
import {thresholdInsertSchema} from "../schemas/temperatureThresholdSchema";
import logger from "../libs/logger";
import temperatureThresholdHandler from "../handlers/temperatureThresholdHandler";
const router = Router();


/* POST temperature threshold.
Update the current temperature Threshold configuration then update the state
*/
router.post('/', validateData(thresholdInsertSchema), async function(req, res, next) {
      const {coldToWarm, warmToHot} = req.body
      try {
        const threshold = await temperatureThresholdHandler.updateThreshold(coldToWarm, warmToHot)
        await temperatureThresholdHandler.updateState(threshold)
        res.status(200).json(threshold)
      } catch (error) {
        logger.error(error)
        res.status(500).send({message: "Error saving threshold"})
      }
    }
);


export default router;