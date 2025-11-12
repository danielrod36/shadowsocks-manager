const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const logger = log4js.getLogger('system');

const { pluginErrorBoundary, PluginError } = require('./error-handler');

/**
 * Plugin lifecycle states
 */
const PluginState = {
  UNLOADED: 'unloaded',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
  UNLOADING: 'unloading'
};

/**
 * Plugin lifecycle hooks
 */
const PluginHooks = {
  SETUP: 'setup',
  REGISTER_ROUTES: 'registerRoutes',
  CLEANUP: 'cleanup',
  HEALTH_CHECK: 'healthCheck'
};

/**
 * Plugin Manager class
 */
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.dependencies = new Map();
    this.config = null;
  }

  /**
   * Initialize plugin manager with configuration
   */
  initialize(config) {
    this.config = config;
    logger.info('Plugin manager initialized');
  }

  /**
   * Load all enabled plugins
   */
  async loadPlugins() {
    if (!this.config || !this.config.plugins) {
      logger.info('No plugins configured');
      return;
    }

    const enabledPlugins = Object.keys(this.config.plugins).filter(
      pluginName => this.config.plugins[pluginName].use
    );

    logger.info(`Loading ${enabledPlugins.length} plugins: ${enabledPlugins.join(', ')}`);

    // Load dependencies first
    await this.loadDependencies(enabledPlugins);

    // Load plugins in dependency order
    for (const pluginName of this.getLoadOrder(enabledPlugins)) {
      await this.loadPlugin(pluginName);
    }

    logger.info('All plugins loaded successfully');
  }

  /**
   * Load plugin dependencies
   */
  async loadDependencies(pluginNames) {
    for (const pluginName of pluginNames) {
      try {
        const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}`);
        const dependencePath = path.join(pluginPath, 'dependence.js');
        
        if (fs.existsSync(dependencePath)) {
          const dependence = require(dependencePath);
          this.dependencies.set(pluginName, dependence);
          logger.debug(`Loaded dependencies for ${pluginName}: ${dependence.join(', ')}`);
        }
      } catch (error) {
        logger.warn(`Failed to load dependencies for ${pluginName}:`, error.message);
      }
    }
  }

  /**
   * Get plugin load order based on dependencies
   */
  getLoadOrder(pluginNames) {
    const loadOrder = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (pluginName) => {
      if (visited.has(pluginName)) return;
      if (visiting.has(pluginName)) {
        throw new PluginError(pluginName, 'Circular dependency detected');
      }

      visiting.add(pluginName);

      // Visit dependencies first
      const deps = this.dependencies.get(pluginName) || [];
      for (const dep of deps) {
        if (pluginNames.includes(dep)) {
          visit(dep);
        }
      }

      visiting.delete(pluginName);
      visited.add(pluginName);
      loadOrder.push(pluginName);
    };

    for (const pluginName of pluginNames) {
      visit(pluginName);
    }

    return loadOrder;
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(pluginName) {
    if (this.plugins.has(pluginName)) {
      logger.warn(`Plugin ${pluginName} is already loaded`);
      return;
    }

    const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}`);
    
    if (!fs.existsSync(pluginPath)) {
      throw new PluginError(pluginName, `Plugin directory not found: ${pluginPath}`);
    }

    const pluginInfo = {
      name: pluginName,
      state: PluginState.LOADING,
      path: pluginPath,
      config: this.config.plugins[pluginName],
      instance: null,
      hooks: new Map(),
      loadedAt: null,
      error: null
    };

    this.plugins.set(pluginName, pluginInfo);

    try {
      // Load plugin database tables
      await this.loadPluginDatabase(pluginName);

      // Load plugin main module
      const pluginModule = require(path.join(pluginPath, 'index.js'));
      
      // Initialize plugin instance
      pluginInfo.instance = pluginModule;
      pluginInfo.state = PluginState.LOADED;
      pluginInfo.loadedAt = new Date();

      // Register plugin hooks
      await this.registerPluginHooks(pluginName, pluginModule);

      logger.info(`Plugin ${pluginName} loaded successfully`);
    } catch (error) {
      pluginInfo.state = PluginState.ERROR;
      pluginInfo.error = error;
      logger.error(`Failed to load plugin ${pluginName}:`, error.message);
      throw error;
    }
  }

  /**
   * Load plugin database tables
   */
  async loadPluginDatabase(pluginName) {
    const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}`);
    const dbPath = path.join(pluginPath, 'db');

    if (!fs.existsSync(dbPath)) {
      return; // No database tables for this plugin
    }

    const dbFiles = fs.readdirSync(dbPath).filter(file => file.endsWith('.js'));
    
    for (const dbFile of dbFiles) {
      try {
        const dbModule = require(path.join(dbPath, dbFile));
        if (typeof dbModule.createTable === 'function') {
          await pluginErrorBoundary(pluginName, () => dbModule.createTable())();
          logger.debug(`Loaded database table for ${pluginName}/${dbFile}`);
        }
      } catch (error) {
        logger.error(`Failed to load database table ${pluginName}/${dbFile}:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Register plugin lifecycle hooks
   */
  async registerPluginHooks(pluginName, pluginModule) {
    const pluginInfo = this.plugins.get(pluginName);
    
    for (const hook of Object.values(PluginHooks)) {
      if (typeof pluginModule[hook] === 'function') {
        pluginInfo.hooks.set(hook, pluginErrorBoundary(pluginName, pluginModule[hook]));
        logger.debug(`Registered ${hook} hook for ${pluginName}`);
      }
    }
  }

  /**
   * Execute plugin lifecycle hook
   */
  async executeHook(pluginName, hook, ...args) {
    const pluginInfo = this.plugins.get(pluginName);
    
    if (!pluginInfo) {
      throw new PluginError(pluginName, `Plugin not found`);
    }

    if (pluginInfo.state !== PluginState.LOADED) {
      throw new PluginError(pluginName, `Plugin is not in loaded state (current: ${pluginInfo.state})`);
    }

    const hookFn = pluginInfo.hooks.get(hook);
    if (!hookFn) {
      return null; // Hook not implemented
    }

    return await hookFn(...args);
  }

  /**
   * Execute hook for all plugins
   */
  async executeHookForAll(hook, ...args) {
    const results = new Map();
    
    for (const [pluginName, pluginInfo] of this.plugins) {
      if (pluginInfo.state === PluginState.LOADED) {
        try {
          const result = await this.executeHook(pluginName, hook, ...args);
          results.set(pluginName, { success: true, result });
        } catch (error) {
          results.set(pluginName, { success: false, error });
          logger.error(`Hook ${hook} failed for ${pluginName}:`, error.message);
        }
      }
    }

    return results;
  }

  /**
   * Get plugin health status
   */
  async getPluginHealth(pluginName) {
    const pluginInfo = this.plugins.get(pluginName);
    
    if (!pluginInfo) {
      return { healthy: false, error: 'Plugin not found' };
    }

    if (pluginInfo.state === PluginState.ERROR) {
      return { healthy: false, error: pluginInfo.error?.message };
    }

    // Execute health check if available
    try {
      const healthResult = await this.executeHook(pluginName, PluginHooks.HEALTH_CHECK);
      return { 
        healthy: true, 
        state: pluginInfo.state,
        loadedAt: pluginInfo.loadedAt,
        healthCheck: healthResult 
      };
    } catch (error) {
      return { 
        healthy: false, 
        state: pluginInfo.state,
        error: error.message 
      };
    }
  }

  /**
   * Get all plugins health status
   */
  async getAllPluginsHealth() {
    const healthStatus = {};
    
    for (const [pluginName] of this.plugins) {
      healthStatus[pluginName] = await this.getPluginHealth(pluginName);
    }

    return healthStatus;
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginName) {
    const pluginInfo = this.plugins.get(pluginName);
    
    if (!pluginInfo) {
      logger.warn(`Plugin ${pluginName} not found for unloading`);
      return;
    }

    pluginInfo.state = PluginState.UNLOADING;

    try {
      // Execute cleanup hook if available
      await this.executeHook(pluginName, PluginHooks.CLEANUP);
      
      // Clear require cache
      const pluginModulePath = require.resolve(path.join(pluginInfo.path, 'index.js'));
      delete require.cache[pluginModulePath];
      
      this.plugins.delete(pluginName);
      logger.info(`Plugin ${pluginName} unloaded successfully`);
    } catch (error) {
      logger.error(`Failed to unload plugin ${pluginName}:`, error.message);
      throw error;
    }
  }

  /**
   * Get plugin information
   */
  getPluginInfo(pluginName) {
    return this.plugins.get(pluginName);
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins() {
    return Array.from(this.plugins.keys());
  }
}

// Create singleton instance
const pluginManager = new PluginManager();

module.exports = {
  PluginManager,
  PluginState,
  PluginHooks,
  pluginManager
};
