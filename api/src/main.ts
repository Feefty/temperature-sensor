import { createApp } from './infrastructure/http/createApp';
import { InMemoryReadingRepository } from './infrastructure/repositories/InMemoryReadingRepository';
import { StubTemperatureSensor } from './infrastructure/sensor/StubTemperatureSensor';

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT "${process.env.PORT ?? ''}": expected an integer in 1..65535`);
}

const app = createApp({
  sensor: new StubTemperatureSensor(),
  repository: new InMemoryReadingRepository(),
});

const server = app.listen(port, () => {
  console.log(`Temperature Sensor API listening on port ${port}`);
});

// Let in-flight requests finish before the container exits (Docker sends SIGTERM).
function shutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  // Force exit if connections do not drain within the container stop grace period.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
