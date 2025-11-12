const yaml = require('js-yaml');
const fs   = require('fs');
const os   = require('os');
const path = require('path');
const _ = require('lodash');

const log4js = require('log4js');
const logger = log4js.getLogger('system');

// Import configuration validation
const { validateConfig, formatValidationErrors } = require('./config-schema');

let config;

const defaultPath = path.resolve(os.homedir() + '/.ssmgr/default.yml');
let configFilePath = defaultPath;
if(global.configFile) {
  if(fs.existsSync(path.resolve(global.configFile))) {
    configFilePath = path.resolve(global.configFile);
  } else if(fs.existsSync(path.resolve(os.homedir() + '/.ssmgr/' + global.configFile))) {
    configFilePath = path.resolve(os.homedir() + '/.ssmgr/' + global.configFile);
  } else {
    logger.error(`Can not find file: ${ global.configFile }`);
    process.exit(1);
  }
}

try {
  logger.info('Config file path: ', configFilePath);
  const configFileData = fs.readFileSync(configFilePath);
  if(configFilePath.substr(configFilePath.length - 5) === '.json') {
    config = JSON.parse(configFileData);
  } else {
    config = yaml.load(configFileData, 'utf8');
  }
} catch (err) {
  logger.error('Failed to load configuration file:', err.message);
  logger.error('Stack trace:', err.stack);
  logger.error('Please check your configuration file syntax and permissions');
  process.exit(1);
}

if (!config) {
  logger.error('Configuration is empty or invalid');
  process.exit(1);
}

// Validate configuration against schema
const validationResult = validateConfig(config);
if (!validationResult.valid) {
  const errorMessages = formatValidationErrors(validationResult.errors);
  logger.error('Configuration validation failed:');
  errorMessages.forEach(msg => logger.error(`  - ${msg}`));
  logger.error('Please fix the configuration errors and restart the application');
  process.exit(1);
}

logger.info('Configuration validation passed');

exports.all = () => {
  return config;
};

exports.get = (path) => {
  if(!config) {
    logger.warn('Attempting to get config value but config is not loaded');
    return;
  }
  return _.get(config, path);
};

exports.set = (path, value) => {
  if(!config) {
    logger.warn('Attempting to set config value but config is not loaded');
    return;
  }
  return _.set(config, path, value);
};
