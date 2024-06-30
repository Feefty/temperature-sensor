import {Router} from 'express';
import sensor from './temperature_sensor';
import threshold from './temperature_threshold';

const router = Router();

router.use('/sensor', sensor);
router.use('/threshold', threshold);
export default router;