/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testRegex: '(?<!\\.e2e)\\.spec\\.ts$',
      transform: { '^.+\\.(t|j)s$': 'ts-jest' },
      collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.module.ts', '!src/main.ts'],
      coverageDirectory: './coverage',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@shared$': '<rootDir>/src/shared',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
      },
    },
    {
      displayName: 'e2e',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testRegex: '\\.e2e\\.spec\\.ts$',
      testEnvironment: 'node',
      testTimeout: 60000,
      maxConcurrency: 1,
      setupFiles: ['<rootDir>/src/test/e2e/jest-e2e.setup.ts'],
      transform: {
        '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@shared$': '<rootDir>/src/shared',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
      },
    },
  ],
};
