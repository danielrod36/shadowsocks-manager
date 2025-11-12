const { PluginManager, PluginState, PluginHooks } = require('../../services/plugin-manager');

describe('Plugin Manager Service', () => {
  let pluginManager;

  beforeEach(() => {
    pluginManager = new PluginManager();
  });

  test('should initialize with empty state', () => {
    expect(pluginManager.plugins).toBeInstanceOf(Map);
    expect(pluginManager.dependencies).toBeInstanceOf(Map);
    expect(pluginManager.config).toBeNull();
  });

  test('should initialize with configuration', () => {
    const config = { plugins: { webgui: { use: true } } };
    pluginManager.initialize(config);
    expect(pluginManager.config).toBe(config);
  });

  test('should get plugin information', () => {
    const pluginInfo = pluginManager.getPluginInfo('nonexistent');
    expect(pluginInfo).toBeUndefined();
  });

  test('should get loaded plugins', () => {
    const loadedPlugins = pluginManager.getLoadedPlugins();
    expect(Array.isArray(loadedPlugins)).toBe(true);
  });

  test('should have plugin lifecycle states', () => {
    expect(PluginState.UNLOADED).toBe('unloaded');
    expect(PluginState.LOADING).toBe('loading');
    expect(PluginState.LOADED).toBe('loaded');
    expect(PluginState.ERROR).toBe('error');
    expect(PluginState.UNLOADING).toBe('unloading');
  });

  test('should have plugin lifecycle hooks', () => {
    expect(PluginHooks.SETUP).toBe('setup');
    expect(PluginHooks.REGISTER_ROUTES).toBe('registerRoutes');
    expect(PluginHooks.CLEANUP).toBe('cleanup');
    expect(PluginHooks.HEALTH_CHECK).toBe('healthCheck');
  });

  test('should calculate plugin load order', () => {
    const pluginNames = ['plugin1', 'plugin2'];
    const loadOrder = pluginManager.getLoadOrder(pluginNames);
    expect(Array.isArray(loadOrder)).toBe(true);
    expect(loadOrder).toEqual(expect.arrayContaining(pluginNames));
  });

  test('should handle circular dependencies', () => {
    // Mock dependencies to create a circular dependency
    pluginManager.dependencies.set('plugin1', ['plugin2']);
    pluginManager.dependencies.set('plugin2', ['plugin1']);
    
    expect(() => {
      pluginManager.getLoadOrder(['plugin1', 'plugin2']);
    }).toThrow('Circular dependency detected');
  });
});
