import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, expect, it } from "@jest/globals";
import request, { Response } from "supertest";

import { AppModule } from "../src/app.module";
import { ClockPort } from "../src/temperature/application/ports/clock.port";
import { IdGeneratorPort } from "../src/temperature/application/ports/id-generator.port";
import { TemperatureSensorPort } from "../src/temperature/application/ports/temperature-sensor.port";
import { TemperatureHistoryResponse } from "../src/temperature/interface/http/dto/temperature-response.dto";
import { CLOCK_PORT, ID_GENERATOR_PORT, TEMPERATURE_SENSOR_PORT } from "../src/temperature/temperature.tokens";

function createSequentialSensor(readings: number[]): TemperatureSensorPort {
  let currentIndex = 0;

  return {
    readTemperature: async (): Promise<number> => {
      const reading: number | undefined = readings[currentIndex];

      if (reading === undefined) {
        throw new Error(`No sensor reading configured at index ${currentIndex}`);
      }

      currentIndex += 1;
      return reading;
    },
  };
}

function createSequentialClock(start: Date): ClockPort {
  let elapsedSeconds = 0;

  return {
    now: (): Date => {
      const currentTime = new Date(start.getTime() + elapsedSeconds * 1000);
      elapsedSeconds += 1;
      return currentTime;
    },
  };
}

function createSequentialIdGenerator(): IdGeneratorPort {
  let sequence = 1;

  return {
    generate: (): string => {
      const id = `temp_req_${String(sequence).padStart(2, "0")}`;
      sequence += 1;
      return id;
    },
  };
}

async function createApplication(readings: number[]): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(TEMPERATURE_SENSOR_PORT)
    .useValue(createSequentialSensor(readings))
    .overrideProvider(CLOCK_PORT)
    .useValue(createSequentialClock(new Date("2026-06-13T10:00:00.000Z")))
    .overrideProvider(ID_GENERATOR_PORT)
    .useValue(createSequentialIdGenerator())
    .compile();
  const app: INestApplication = module.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return app;
}

describe("Temperature API end to end", () => {
  it("preserves old classifications after thresholds change", async (): Promise<void> => {
    const app: INestApplication = await createApplication([29.5, 30]);

    try {
      await request(app.getHttpServer()).get("/thresholds").expect(200).expect({ coldThreshold: 22, hotThreshold: 35 });

      await request(app.getHttpServer())
        .post("/temperature-requests")
        .expect(201)
        .expect({
          id: "temp_req_01",
          temperature: 29.5,
          state: "WARM",
          thresholds: { coldThreshold: 22, hotThreshold: 35 },
          capturedAt: "2026-06-13T10:00:00.000Z",
        });

      await request(app.getHttpServer()).patch("/thresholds").send({ hotThreshold: 28 }).expect(200).expect({ coldThreshold: 22, hotThreshold: 28 });

      await request(app.getHttpServer())
        .post("/temperature-requests")
        .expect(201)
        .expect({
          id: "temp_req_02",
          temperature: 30,
          state: "HOT",
          thresholds: { coldThreshold: 22, hotThreshold: 28 },
          capturedAt: "2026-06-13T10:00:01.000Z",
        });

      const historyResponse: Response = await request(app.getHttpServer()).get("/temperature-requests").expect(200);
      const history: TemperatureHistoryResponse = historyResponse.body as TemperatureHistoryResponse;

      expect(history).toEqual({
        items: [
          {
            id: "temp_req_02",
            temperature: 30,
            state: "HOT",
            thresholds: { coldThreshold: 22, hotThreshold: 28 },
            capturedAt: "2026-06-13T10:00:01.000Z",
          },
          {
            id: "temp_req_01",
            temperature: 29.5,
            state: "WARM",
            thresholds: { coldThreshold: 22, hotThreshold: 35 },
            capturedAt: "2026-06-13T10:00:00.000Z",
          },
        ],
        count: 2,
        maxSize: 15,
      });
    } finally {
      await app.close();
    }
  });

  it("returns only the latest 15 captures newest first", async (): Promise<void> => {
    const readings: number[] = Array.from({ length: 16 }, (_, index: number): number => index);
    const app: INestApplication = await createApplication(readings);

    try {
      for (const reading of readings) {
        await request(app.getHttpServer())
          .post("/temperature-requests")
          .expect(201)
          .expect((response: Response): void => {
            expect(response.body.temperature).toBe(reading);
          });
      }

      const historyResponse: Response = await request(app.getHttpServer()).get("/temperature-requests").expect(200);
      const history: TemperatureHistoryResponse = historyResponse.body as TemperatureHistoryResponse;

      expect(history.count).toBe(15);
      expect(history.maxSize).toBe(15);
      expect(history.items.map((item): string => item.id)).toEqual(["temp_req_16", "temp_req_15", "temp_req_14", "temp_req_13", "temp_req_12", "temp_req_11", "temp_req_10", "temp_req_09", "temp_req_08", "temp_req_07", "temp_req_06", "temp_req_05", "temp_req_04", "temp_req_03", "temp_req_02"]);
    } finally {
      await app.close();
    }
  });
});
