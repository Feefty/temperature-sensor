import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "@infrastructure/http/app";

const prisma = new PrismaClient();

const app = createApp(prisma);

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.temperatureReading.deleteMany();
  await prisma.thresholdConfig.deleteMany();
});

afterAll(async () => {
  await prisma.temperatureReading.deleteMany();
  await prisma.thresholdConfig.deleteMany();
  await prisma.$disconnect();
});

describe("GET /temperature", () => {
  it("should return a temperature reading with id, value, state, and recordedAt", async () => {
    const response = await request(app).get("/temperature");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("value");
    expect(response.body).toHaveProperty("state");
    expect(response.body).toHaveProperty("recordedAt");
    expect(typeof response.body.value).toBe("number");
    expect(["HOT", "COLD", "WARM"]).toContain(response.body.state);
  });

  it("should save the reading to history", async () => {
    await request(app).get("/temperature");

    const history = await request(app).get("/temperature/history");
    expect(history.body).toHaveLength(1);
  });
});

describe("GET /temperature/history", () => {
  it("should return an empty array when no readings exist", async () => {
    const response = await request(app).get("/temperature/history");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return readings ordered by most recent first", async () => {
    await request(app).get("/temperature");
    await request(app).get("/temperature");
    await request(app).get("/temperature");

    const response = await request(app).get("/temperature/history");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    const dates = response.body.map(
      (r: { recordedAt: string }) => new Date(r.recordedAt)
    );
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
    }
  });

  it("should return a maximum of 15 readings", async () => {
    const promises = Array.from({ length: 20 }, () =>
      request(app).get("/temperature")
    );
    await Promise.all(promises);

    const response = await request(app).get("/temperature/history");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(15);
  });
});

describe("GET /temperature/thresholds", () => {
  it("should return default thresholds", async () => {
    const response = await request(app).get("/temperature/thresholds");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ coldMax: 22, hotMin: 35 });
  });
});

describe("PUT /temperature/thresholds", () => {
  it("should update thresholds with valid values", async () => {
    const response = await request(app)
      .put("/temperature/thresholds")
      .send({ coldMax: 15, hotMin: 40 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ coldMax: 15, hotMin: 40 });

    const getResponse = await request(app).get("/temperature/thresholds");
    expect(getResponse.body).toEqual({ coldMax: 15, hotMin: 40 });
  });

  it("should return 400 when coldMax >= hotMin", async () => {
    const response = await request(app)
      .put("/temperature/thresholds")
      .send({ coldMax: 40, hotMin: 15 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when fields are missing", async () => {
    const response = await request(app)
      .put("/temperature/thresholds")
      .send({ coldMax: 15 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when values are not numbers", async () => {
    const response = await request(app)
      .put("/temperature/thresholds")
      .send({ coldMax: "abc", hotMin: 40 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should use updated thresholds for classification", async () => {
    // Set thresholds so that 30 becomes HOT
    await request(app)
      .put("/temperature/thresholds")
      .send({ coldMax: 10, hotMin: 25 });

    // Read multiple temperatures and check they use new thresholds
    const response = await request(app).get("/temperature/thresholds");
    expect(response.body).toEqual({ coldMax: 10, hotMin: 25 });
  });
});
