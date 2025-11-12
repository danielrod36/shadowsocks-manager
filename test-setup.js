// Test setup file for Jest
const path = require('path');

// Mock the appRequire function that's used throughout the codebase
global.appRequire = (modulePath) => {
  const fullPath = path.join(__dirname, modulePath);
  return require(fullPath);
};

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup environment variables for testing
process.env.NODE_ENV = 'test';

// Set test configuration file path
global.configFile = 'test-config.yml';
