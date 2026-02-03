import 'dotenv/config';
import { createApp } from './interface/http/app.js';
import { createContainer } from './infrastructure/container/index.js';
import { env, disconnectPrisma } from './infrastructure/config/index.js';

async function main() {
  try {
    createContainer();
    console.log('✅ Container initialized');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`Env : ${env.NODE_ENV}`);
      console.log(`Default thresholds: HOT >= ${env.DEFAULT_HOT_THRESHOLD}°C, COLD < ${env.DEFAULT_COLD_THRESHOLD}°C`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectPrisma();
        console.log('👋 Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();
