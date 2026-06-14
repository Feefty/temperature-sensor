import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'src/infrastructure/test',
    'api-core/test/integration',
    'api-core/test/api',
    'api-core/test/security',
  ],
  transform: { '^.+\\.ts$': 'ts-jest' },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/controllers/**',
    '!src/**/interceptors/**',
    '!src/**/validation/zod-validation.pipe.ts',
    '!src/infrastructure/**',
    '!src/**/configuration/**',
  ],
  coverageThreshold: {
    global: { branches: 80, functions: 90, lines: 85, statements: 85 },
  },
};

export default config;
