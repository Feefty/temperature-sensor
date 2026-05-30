module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: { branches: 90, functions: 95, lines: 90, statements: 90 },
  },
};
