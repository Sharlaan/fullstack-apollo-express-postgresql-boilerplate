// https://jestjs.io/docs/en/getting-started
'use strict';

module.exports = {
  collectCoverageFrom: ['src/**.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '(<rootDir>/__tests__/(unit|e2e)/.*|(\\.|/)(test|spec))\\.js$',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
