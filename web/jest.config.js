// ABOUTME: Jest configuration for web UI unit tests
// ABOUTME: Uses jsdom environment for DOM testing with jQuery

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/js/__tests__/setup.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/js/__tests__/styleMock.js',
  },
};
