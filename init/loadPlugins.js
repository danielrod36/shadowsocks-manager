const config = appRequire('services/config').all();
const { pluginManager } = appRequire('services/plugin-manager');

const log4js = require('log4js');
const logger = log4js.getLogger('system');

const loadPlugins = async () => {
  if(!config.plugins) {
    logger.info('No plugins configured');
    return;
  }
  
  if(config.type !== 'm') {
    logger.info('Plugin loading skipped (not manager type)');
    return;
  }

  try {
    // Initialize plugin manager with configuration
    pluginManager.initialize(config);
    
    // Load all enabled plugins
    await pluginManager.loadPlugins();
    
    // Execute setup hooks for all plugins
    await pluginManager.executeHookForAll('setup');
    
    // Execute route registration hooks for all plugins
    await pluginManager.executeHookForAll('registerRoutes');
    
    logger.info('Plugin lifecycle management completed successfully');
  } catch (error) {
    logger.error('Failed to load plugins:', error.message);
    logger.error('Stack trace:', error.stack);
    throw error;
  }
};

loadPlugins();
