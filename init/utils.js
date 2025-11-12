const path = require('path');
const cluster = require('cluster');
const process = require('process');
const { initializeCoreServices, service, model, plugin } = require('../services/dependency-container');

// Initialize core services
initializeCoreServices();

// Global appRequire for backward compatibility (deprecated)
global.appRequire = filePath => {
  console.warn(`appRequire('${filePath}') is deprecated. Use service(), model(), or plugin() instead.`);
  
  // Try to resolve using new dependency system
  try {
    if (filePath.startsWith('services/')) {
      const serviceName = filePath.replace('services/', '');
      return service(serviceName);
    } else if (filePath.startsWith('models/')) {
      const modelName = filePath.replace('models/', '');
      return model(modelName);
    } else if (filePath.startsWith('plugins/')) {
      const parts = filePath.replace('plugins/', '').split('/');
      const pluginName = parts[0];
      const subpath = parts.slice(1).join('/') || 'index';
      return plugin(pluginName, subpath);
    }
  } catch (error) {
    // Fallback to original behavior
    return require(path.resolve(__dirname, '../' + filePath));
  }
};

global.isMainWorker = () => (+cluster.worker.id) === (+process.env.mainWorker);

// Export new dependency functions for modern usage
global.service = service;
global.model = model;
global.plugin = plugin;
