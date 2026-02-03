-- CreateTable
CREATE TABLE "temperature" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threshold_configs" (
    "id" TEXT NOT NULL,
    "hotThreshold" DOUBLE PRECISION NOT NULL DEFAULT 35,
    "coldThreshold" DOUBLE PRECISION NOT NULL DEFAULT 22,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threshold_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "temperature_createdAt_idx" ON "temperature"("createdAt" DESC);
