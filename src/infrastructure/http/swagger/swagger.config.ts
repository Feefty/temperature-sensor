import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Temperature Sensor API",
      version: "1.0.0",
      description:
        "API for reading temperature sensor data, managing thresholds, and viewing history.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/infrastructure/http/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
