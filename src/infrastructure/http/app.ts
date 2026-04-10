import express from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger";
import { ErrorHandler } from "./middleware/ErrorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(ErrorHandler);

export default app;