import { PrismaClient } from '../database/generated/prisma/index.js';
import { getPrismaClient } from '../config/index.js';

import { ITemperatureSensor } from '../../application/interfaces/index.js';
import { ITemperatureRepository, IThresholdConfigRepository } from '../../domain/repositories/index.js';

import { RandomTemperatureSensor } from '../sensors/index.js';
import { PrismaTemperatureRepository, PrismaThresholdConfigRepository } from '../database/repositories/index.js';

import {
  GetCurrentTemperatureUseCase,
  GetTemperatureHistoryUseCase,
  GetThresholdsUseCase,
  UpdateThresholdsUseCase
} from '../../application/use-cases/index.js';

export interface Container {
  prisma: PrismaClient;
  temperatureSensor: ITemperatureSensor;
  temperatureRepository: ITemperatureRepository;
  thresholdConfigRepository: IThresholdConfigRepository;
  getCurrentTemperatureUseCase: GetCurrentTemperatureUseCase;
  getTemperatureHistoryUseCase: GetTemperatureHistoryUseCase;
  getThresholdsUseCase: GetThresholdsUseCase;
  updateThresholdsUseCase: UpdateThresholdsUseCase;
}

let containerInstance: Container | null = null;

export function createContainer(): Container {
  if (containerInstance) {
    return containerInstance;
  }

  const prisma = getPrismaClient();

  const temperatureSensor = new RandomTemperatureSensor();
  const temperatureRepository = new PrismaTemperatureRepository(prisma);
  const thresholdConfigRepository = new PrismaThresholdConfigRepository(prisma);

  const getCurrentTemperatureUseCase = new GetCurrentTemperatureUseCase(
    temperatureSensor,
    temperatureRepository,
    thresholdConfigRepository
  );

  const getTemperatureHistoryUseCase = new GetTemperatureHistoryUseCase(temperatureRepository);

  const getThresholdsUseCase = new GetThresholdsUseCase(thresholdConfigRepository);

  const updateThresholdsUseCase = new UpdateThresholdsUseCase(thresholdConfigRepository);

  containerInstance = {
    prisma,
    temperatureSensor,
    temperatureRepository,
    thresholdConfigRepository,
    getCurrentTemperatureUseCase,
    getTemperatureHistoryUseCase,
    getThresholdsUseCase,
    updateThresholdsUseCase
  };

  return containerInstance;
}

export function getContainer(): Container {
  if (!containerInstance) {
    throw new Error('Container not initialized. Call createContainer() first.');
  }
  return containerInstance;
}
