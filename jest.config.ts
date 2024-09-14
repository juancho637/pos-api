import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js}',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.seeder.ts',
    '!<rootDir>/dist/**',
  ],
  testRegex: 'test/.*\\.spec\\.ts$',
  moduleNameMapper: {
    // Common
    '@common/helpers/(.*)': '<rootDir>/src/common/helpers/$1',
    '@common/adapters/configuration/(.*)':
      '<rootDir>/src/common/adapters/configuration/$1',
    '@common/adapters/database/(.*)':
      '<rootDir>/src/common/adapters/database/$1',
    '@common/adapters/logger/(.*)': '<rootDir>/src/common/adapters/logger/$1',
    '@common/adapters/exception/(.*)':
      '<rootDir>/src/common/adapters/exception/$1',
    '@common/adapters/hash/(.*)': '<rootDir>/src/common/adapters/hash/$1',
    '@common/adapters/token/(.*)': '<rootDir>/src/common/adapters/token/$1',

    // Modules
    '@modules/permissions/(.*)': '<rootDir>/src/modules/permissions/$1',
    '@modules/roles/(.*)': '<rootDir>/src/modules/roles/$1',
    '@modules/users/(.*)': '<rootDir>/src/modules/users/$1',
    '@modules/auth/(.*)': '<rootDir>/src/modules/auth/$1',
    '@modules/categories/(.*)': '<rootDir>/src/modules/categories/$1',
    '@modules/providers/(.*)': '<rootDir>/src/modules/providers/$1',
    '@modules/customers/(.*)': '<rootDir>/src/modules/customers/$1',
    '@modules/counters/(.*)': '<rootDir>/src/modules/counters/$1',
    '@modules/orders/(.*)': '<rootDir>/src/modules/orders/$1',

    // tests
    '@test/mocks': '<rootDir>/test/mocks',
    '@test/utils': '<rootDir>/test/utils',
  },
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['index.ts', '.*\\.module\\.ts$'],
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
