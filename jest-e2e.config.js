/* eslint-disable @typescript-eslint/no-var-requires */
/** Jest config used by `npm run test:e2e` (separate from `jest.config.js` unit project). */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.e2e\\.spec\\.ts$',
  testEnvironment: 'node',
  testTimeout: 60000,
  setupFiles: ['<rootDir>/src/test/e2e/jest-e2e.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/e2e/jest-e2e.setup-after-env.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@shared$': '<rootDir>/src/shared',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  collectCoverage: false,
  cacheDirectory: '<rootDir>/.jest-e2e-cache',
};
