import { ConfigServerModel } from './models/config-server.model';

export function serverConfig(): ConfigServerModel {
  return {
    port: +process.env.SERVICE_PORT!,
    hostname: process.env.SERVICE_HOST!,
    globalPrefix: process.env.API_GLOBAL_PREFIX!,
  };
}
