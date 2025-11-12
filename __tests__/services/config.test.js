// Mock the global configFile before requiring the config service
global.configFile = './test-config.yml';

const configService = require('../../services/config');

describe('Config Service', () => {
  test('should load configuration from file', () => {
    const config = configService.all();
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('should get specific configuration section', () => {
    const dbConfig = configService.get('db');
    expect(dbConfig).toBeDefined();
    expect(dbConfig).toHaveProperty('host');
    expect(dbConfig).toHaveProperty('database');
  });

  test('should handle missing configuration gracefully', () => {
    const missingConfig = configService.get('nonexistent');
    expect(missingConfig).toBeUndefined();
  });

  test('should set configuration values', () => {
    const originalValue = configService.get('testKey');
    configService.set('testKey', 'testValue');
    expect(configService.get('testKey')).toBe('testValue');
    
    // Clean up
    if (originalValue === undefined) {
      delete configService.all().testKey;
    } else {
      configService.set('testKey', originalValue);
    }
  });

  test('should validate configuration structure', () => {
    const config = configService.all();
    
    // Check for required top-level sections
    expect(config).toHaveProperty('db');
    expect(config).toHaveProperty('plugins');
    expect(config).toHaveProperty('port');
    
    // Check database configuration structure
    expect(config.db).toHaveProperty('host');
    expect(config.db).toHaveProperty('database');
    
    // Check plugins configuration
    expect(config.plugins).toHaveProperty('webgui');
    expect(config.plugins.webgui).toHaveProperty('use');
  });
});
