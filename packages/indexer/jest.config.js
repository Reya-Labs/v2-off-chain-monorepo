/* eslint-disable no-undef */

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json-summary'],
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [
    '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$',
    '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$',
    '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$',
  ],
};
