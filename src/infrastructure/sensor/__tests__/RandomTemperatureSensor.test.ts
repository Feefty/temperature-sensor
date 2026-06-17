import { RandomTemperatureSensor } from "@infrastructure/sensor/RandomTemperatureSensor.ts";

describe("RandomTemperatureSensor", () => {
  it("returns a temperature within default range [-10, 50]", async () => {
    const sensor = new RandomTemperatureSensor();

    const readings: number[] = [];
    for (let i = 0; i < 100; i++) {
      const temp = await sensor.read();
      readings.push(temp.celsius);
    }

    const min = Math.min(...readings);
    const max = Math.max(...readings);

    expect(min).toBeGreaterThanOrEqual(-10);
    expect(max).toBeLessThanOrEqual(50);
  });

  it("returns a temperature within configured custom range", async () => {
    const sensor = new RandomTemperatureSensor(15, 30);

    const readings: number[] = [];
    for (let i = 0; i < 100; i++) {
      const temp = await sensor.read();
      readings.push(temp.celsius);
    }

    const min = Math.min(...readings);
    const max = Math.max(...readings);

    expect(min).toBeGreaterThanOrEqual(15);
    expect(max).toBeLessThanOrEqual(30);
  });

  it("returns values rounded to 1 decimal place", async () => {
    const sensor = new RandomTemperatureSensor();

    for (let i = 0; i < 50; i++) {
      const temp = await sensor.read();
      const decimals = temp.celsius.toString().split(".")[1];
      if (decimals) {
        expect(decimals.length).toBeLessThanOrEqual(1);
      }
    }
  });
});
