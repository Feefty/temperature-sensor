import app from './app';
import logger from "./libs/logger";

const port = process.env.APP_PORT;
app.listen(port, () => {
    logger.info(`Listening: http://localhost:${port}`);
});