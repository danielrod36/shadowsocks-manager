const AJV = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new AJV({
  allErrors: true,
  strict: false,
  useDefaults: true,
  coerceTypes: true
});
addFormats(ajv);

// Core configuration schema
const coreSchema = {
  type: 'object',
  required: ['type', 'shadowsocks', 'manager'],
  properties: {
    type: {
      type: 'string',
      enum: ['s', 'm'],
      description: 'Server type: s (single) or m (manager)'
    },
    shadowsocks: {
      type: 'object',
      required: ['address'],
      properties: {
        address: {
          type: 'string',
          format: 'hostname',
          description: 'Shadowsocks manager API address'
        }
      }
    },
    manager: {
      type: 'object',
      required: ['address', 'password'],
      properties: {
        address: {
          type: 'string',
          format: 'hostname',
          description: 'Manager API address'
        },
        password: {
          type: 'string',
          minLength: 8,
          description: 'Manager password (minimum 8 characters)'
        }
      }
    },
    db: {
      oneOf: [
        { type: 'string' }, // SQLite path
        {
          type: 'object',
          required: ['host', 'user', 'password', 'database'],
          properties: {
            host: { type: 'string' },
            user: { type: 'string' },
            password: { type: 'string' },
            database: { type: 'string' },
            port: { type: 'integer', minimum: 1, maximum: 65535, default: 3306 }
          }
        }
      ]
    },
    log: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug', 'trace'],
          default: 'info'
        },
        filename: { type: 'string', default: 'ssmgr.log' }
      }
    },
    security: {
      type: 'object',
      properties: {
        rate_limit: { type: 'boolean', default: true },
        helmet: { type: 'boolean', default: true },
        cors: { type: 'boolean', default: true }
      }
    },
    plugins: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          use: { type: 'boolean' }
        },
        additionalProperties: true
      }
    }
  }
};

// Plugin-specific schemas
const pluginSchemas = {
  webgui: {
    type: 'object',
    required: ['site', 'admin_username', 'admin_password'],
    properties: {
      use: { type: 'boolean' },
      site: { type: 'string', format: 'uri' },
      admin_username: { type: 'string', format: 'email' },
      admin_password: { type: 'string', minLength: 8 }
    }
  },
  webgui_telegram: {
    type: 'object',
    properties: {
      use: { type: 'boolean' },
      token: { type: 'string', minLength: 10 }
    }
  },
  email: {
    type: 'object',
    properties: {
      use: { type: 'boolean' },
      type: { type: 'string', enum: ['smtp'] },
      username: { type: 'string', format: 'email' },
      password: { type: 'string' },
      host: { type: 'string' },
      port: { type: 'integer', minimum: 1, maximum: 65535 }
    }
  },
  freeAccount: {
    type: 'object',
    properties: {
      use: { type: 'boolean' },
      time: { type: 'integer', minimum: 1, maximum: 30 }
    }
  },
  flowSaver: {
    type: 'object',
    properties: {
      use: { type: 'boolean' },
      time: { type: 'integer', minimum: 1, maximum: 60 }
    }
  }
};

// Compile schemas
const validateCore = ajv.compile(coreSchema);

// Plugin validation functions
const pluginValidators = {};
Object.keys(pluginSchemas).forEach(pluginName => {
  pluginValidators[pluginName] = ajv.compile(pluginSchemas[pluginName]);
});

/**
 * Validate configuration against schema
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with { valid: boolean, errors: Array }
 */
function validateConfig(config) {
  const result = {
    valid: false,
    errors: []
  };

  // Validate core configuration
  const coreValid = validateCore(config);
  if (!coreValid) {
    result.errors.push(...validateCore.errors.map(err => ({
      type: 'core',
      path: err.instancePath,
      message: err.message,
      params: err.params
    })));
  }

  // Validate plugin configurations
  if (config.plugins) {
    Object.keys(config.plugins).forEach(pluginName => {
      const pluginConfig = config.plugins[pluginName];
      
      if (pluginValidators[pluginName]) {
        const pluginValid = pluginValidators[pluginName](pluginConfig);
        if (!pluginValid) {
          result.errors.push(...pluginValidators[pluginName].errors.map(err => ({
            type: `plugin.${pluginName}`,
            path: err.instancePath,
            message: err.message,
            params: err.params
          })));
        }
      }
    });
  }

  result.valid = result.errors.length === 0;
  return result;
}

/**
 * Get human-readable error messages
 * @param {Array} errors - Validation errors
 * @returns {Array} Formatted error messages
 */
function formatValidationErrors(errors) {
  return errors.map(error => {
    const path = error.path ? ` at path "${error.path}"` : '';
    return `[${error.type}] ${error.message}${path}`;
  });
}

module.exports = {
  validateConfig,
  formatValidationErrors,
  coreSchema,
  pluginSchemas
};
