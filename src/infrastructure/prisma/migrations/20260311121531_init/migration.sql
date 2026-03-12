-- CreateTable
CREATE TABLE "temperature_readings" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "state" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temperature_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threshold_configs" (
    "id" TEXT NOT NULL,
    "coldMax" DOUBLE PRECISION NOT NULL,
    "hotMin" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threshold_configs_pkey" PRIMARY KEY ("id")
);
