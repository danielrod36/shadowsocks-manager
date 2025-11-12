const log4js = require('log4js');
const logger = log4js.getLogger('system');

/**
 * Dependency Injection Container
 * Replaces the global appRequire pattern with explicit dependency management
 */
class DependencyContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
  }

  /**
   * Register a service by name
   */
  register(name, implementation, options = {}) {
    const { singleton = false, factory = false } = options;

    if (singleton) {
      this.singletons.set(name, implementation);
    } else if (factory) {
      this.factories.set(name, implementation);
    } else {
      this.services.set(name, implementation);
    }

    logger.debug(`Registered service: ${name} (singleton: ${singleton}, factory: ${factory})`);
  }

  /**
   * Get a service instance
   */
  get(name) {
    // Check for singleton first
    if (this.singletons.has(name)) {
      const singleton = this.singletons.get(name);
      return typeof singleton === 'function' ? singleton() : singleton;
    }

    // Check for factory
    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      return factory(this);
    }

    // Check for regular service
    if (this.services.has(name)) {
      const service = this.services.get(name);
      return typeof service === 'function' ? service() : service;
    }

    throw new Error(`Service not found: ${name}`);
  }

  /**
   * Check if a service exists
   */
  has(name) {
    return this.services.has(name) || this.singletons.has(name) || this.factories.has(name);
  }

  /**
   * Register multiple services at once
   */
  registerAll(services) {
    Object.entries(services).forEach(([name, implementation]) => {
      this.register(name, implementation);
    });
  }

  /**
   * Clear all registered services
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
    logger.debug('Dependency container cleared');
  }

  /**
   * Get all registered service names
   */
  getServiceNames() {
    return [
      ...this.services.keys(),
      ...this.singletons.keys(),
      ...this.factories.keys()
    ];
  }
}

// Create global dependency container instance
const container = new DependencyContainer();

/**
 * Initialize core services
 */
function initializeCoreServices() {
  // Register configuration service as singleton
  const configService = require('./config');
  container.register('config', configService, { singleton: true });

  // Register error handler as singleton
  const errorHandler = require('./error-handler');
  container.register('errorHandler', errorHandler, { singleton: true });

  // Register plugin manager as singleton
  const pluginManager = require('./plugin-manager');
  container.register('pluginManager', pluginManager.pluginManager, { singleton: true });

  logger.info('Core services initialized in dependency container');
}

/**
 * Service locator function (replacement for appRequire)
 */
function service(name) {
  if (!container.has(name)) {
    // Try to auto-register common services
    try {
      const serviceModule = require(`./${name}`);
      container.register(name, serviceModule, { singleton: true });
      logger.debug(`Auto-registered service: ${name}`);
    } catch (error) {
      throw new Error(`Service not found and cannot auto-register: ${name}`);
    }
  }

  return container.get(name);
}

/**
 * Model locator function
 */
function model(name) {
  try {
    return require(`../models/${name}`);
  } catch (error) {
    throw new Error(`Model not found: ${name}`);
  }
}

/**
 * Plugin locator function
 */
function plugin(name, subpath = 'index') {
  try {
    return require(`../plugins/${name}/${subpath}`);
  } catch (error) {
    throw new Error(`Plugin not found: ${name}/${subpath}`);
  }
}

module.exports = {
  DependencyContainer,
  container,
  initializeCoreServices,
  service,
  model,
  plugin
};
