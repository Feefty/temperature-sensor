import { randomUUID } from 'crypto';
import { PrismaClient } from './generated/prisma/index.js';
import { env } from '../config/env.js';

const prisma = new PrismaClient();

async function seed() {
  const existingConfig = await prisma.thresholdConfig.findFirst();

  if (!existingConfig) {
    await prisma.thresholdConfig.create({
      data: {
        id: randomUUID(),
        hotThreshold: env.DEFAULT_HOT_THRESHOLD,
        coldThreshold: env.DEFAULT_COLD_THRESHOLD
      }
    });
    console.log(
      `✅ Created default threshold config: HOT >= ${env.DEFAULT_HOT_THRESHOLD}°C, COLD < ${env.DEFAULT_COLD_THRESHOLD}°C`
    );
  } else {
    console.log('ℹ️  Threshold config already exists, skipping seed.');
  }

  console.log('🌱 Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
