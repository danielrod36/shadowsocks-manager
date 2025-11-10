# Code Migration Guide

## Overview

This guide helps developers migrate code that uses deprecated packages to their modern replacements. Follow these instructions carefully to ensure compatibility.

## Table of Contents

1. [request/request-promise → axios](#1-requestrequest-promise--axios)
2. [js-yaml API Changes](#2-js-yaml-api-changes)
3. [express-validator API Changes](#3-express-validator-api-changes)
4. [mysql → mysql2](#4-mysql--mysql2)
5. [ESLint Configuration Updates](#5-eslint-configuration-updates)
6. [Babel Configuration Updates](#6-babel-configuration-updates)

---

## 1. request/request-promise → axios

The `request` and `request-promise` packages are deprecated and no longer maintained. Replace them with `axios`.

### Files Affected

- `plugins/webgui_telegram/index.js`
- `plugins/webgui/server/admin.js`
- `plugins/telegram/index.js`
- `plugins/freeAccount/index.js`

### Migration Steps

#### Before (request-promise):

```javascript
const rp = require('request-promise');

// GET request
const response = await rp({
  uri: 'https://api.example.com/data',
  method: 'GET',
  json: true,
  headers: {
    'Authorization': 'Bearer token'
  }
});

// POST request
const result = await rp({
  uri: 'https://api.example.com/data',
  method: 'POST',
  json: true,
  body: {
    key: 'value'
  }
});

// With query parameters
const data = await rp({
  uri: 'https://api.example.com/search',
  qs: {
    q: 'search term',
    limit: 10
  },
  json: true
});
```

#### After (axios):

```javascript
const axios = require('axios');

// GET request
const response = await axios.get('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer token'
  }
});
const data = response.data;

// POST request
const result = await axios.post('https://api.example.com/data', {
  key: 'value'
});
const resultData = result.data;

// With query parameters
const response = await axios.get('https://api.example.com/search', {
  params: {
    q: 'search term',
    limit: 10
  }
});
const data = response.data;
```

### Key Differences

| Feature | request-promise | axios |
|---------|----------------|-------|
| Response data | Direct return | `response.data` |
| Query params | `qs` option | `params` option |
| Request body | `body` option | Second parameter |
| JSON parsing | `json: true` | Automatic |
| Error handling | Same | Same (try/catch) |

### Error Handling

#### Before:

```javascript
try {
  const response = await rp({
    uri: 'https://api.example.com/data',
    json: true
  });
} catch (err) {
  console.error('Status:', err.statusCode);
  console.error('Body:', err.error);
}
```

#### After:

```javascript
try {
  const response = await axios.get('https://api.example.com/data');
  const data = response.data;
} catch (err) {
  if (err.response) {
    console.error('Status:', err.response.status);
    console.error('Body:', err.response.data);
  } else {
    console.error('Error:', err.message);
  }
}
```

### Complete Example Migration

**File: `plugins/telegram/index.js`**

#### Before:

```javascript
const rp = require('request-promise');

const sendMessage = async (chatId, text) => {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  return await rp({
    uri: url,
    method: 'POST',
    json: true,
    body: {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    }
  });
};
```

#### After:

```javascript
const axios = require('axios');

const sendMessage = async (chatId, text) => {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await axios.post(url, {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  });
  return response.data;
};
```

---

## 2. js-yaml API Changes

js-yaml v4 deprecated `safeLoad()` in favor of `load()`.

### Files Affected

- `services/config.js`

### Migration Steps

#### Before (js-yaml v3):

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

// Using safeLoad (deprecated)
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

// Using load (unsafe in v3)
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
```

#### After (js-yaml v4):

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

// load() is now safe by default
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

// Explicit schema (optional)
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'), {
  schema: yaml.DEFAULT_SCHEMA
});
```

### Key Changes

- `yaml.safeLoad()` → `yaml.load()` (now safe by default)
- `yaml.safeDump()` → `yaml.dump()` (now safe by default)
- Custom schemas require explicit specification
- Better error messages and validation

### Error Handling

```javascript
try {
  const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
} catch (err) {
  if (err.name === 'YAMLException') {
    console.error('YAML parsing error:', err.message);
    console.error('Line:', err.mark.line);
    console.error('Column:', err.mark.column);
  } else {
    console.error('File read error:', err.message);
  }
}
```

---

## 3. express-validator API Changes

express-validator v7 has a cleaner API structure.

### Migration Steps

#### Before (v5):

```javascript
const { check, validationResult } = require('express-validator/check');

app.post('/user', [
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

#### After (v7):

```javascript
const { check, validationResult } = require('express-validator');

app.post('/user', [
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### Key Changes

- Import from `express-validator` instead of `express-validator/check`
- API remains mostly compatible
- Better TypeScript support
- Improved error messages

---

## 4. mysql → mysql2

mysql2 is a drop-in replacement with better performance and Promise support.

### Migration Steps

#### Before (mysql):

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ssmgr'
});

connection.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});
```

#### After (mysql2):

```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ssmgr'
});

const [results] = await connection.query('SELECT * FROM users');
console.log(results);
```

### Key Changes

- Use `mysql2/promise` for async/await support
- Query results return `[rows, fields]` tuple
- Better prepared statement support
- Faster performance

### With Knex (Already Configured)

The project uses Knex, which already supports mysql2:

```javascript
// knexfile.js or config
{
  client: 'mysql2',  // Changed from 'mysql'
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ssmgr'
  }
}
```

---

## 5. ESLint Configuration Updates

### Before (.eslintrc.json with ESLint 5):

```json
{
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": "off"
  }
}
```

### After (ESLint 9 with Flat Config):

Create `eslint.config.js`:

```javascript
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        node: true,
        es2021: true
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  }
];
```

### Migration Notes

- ESLint 9 uses flat config format
- `babel-eslint` is deprecated, use `@babel/eslint-parser` if needed
- Better performance and clearer configuration
- Supports ESM and CommonJS

---

## 6. Babel Configuration Updates

### Before (package.json):

```json
{
  "devDependencies": {
    "@babel/polyfill": "^7.12.1",
    "babel-eslint": "^10.1.0"
  }
}
```

### After (package.json):

```json
{
  "devDependencies": {
    "@babel/preset-env": "^7.24.0"
  }
}
```

### Key Changes

- `@babel/polyfill` is deprecated
- Use `@babel/preset-env` with `useBuiltIns` option
- `babel-eslint` replaced by `@babel/eslint-parser`

### Babel Config (.babelrc or babel.config.js):

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '18'
      },
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
};
```

---

## Testing Your Migration

### 1. Install Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Run Linter

```bash
npm run check
```

### 3. Build Project

```bash
npm run build
```

### 4. Run Application

```bash
npm start
```

### 5. Test API Endpoints

```bash
# Test login
curl -X POST http://localhost:8080/api/home/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test rate limiting
for i in {1..10}; do
  curl http://localhost:8080/api/home/login
done
```

### 6. Check for Errors

```bash
# Monitor logs
tail -f ~/.ssmgr/logs/system.log

# Check for deprecation warnings
node --trace-warnings server.js
```

---

## Common Issues and Solutions

### Issue 1: "Cannot find module 'request'"

**Solution**: Replace all `require('request')` with `require('axios')` and update the code.

### Issue 2: "yaml.safeLoad is not a function"

**Solution**: Change `yaml.safeLoad()` to `yaml.load()`.

### Issue 3: ESLint parsing errors

**Solution**: Update ESLint configuration to use flat config format.

### Issue 4: Native module compilation fails

**Solution**:
```bash
npm install --build-from-source
npm rebuild
```

### Issue 5: Database connection errors with mysql2

**Solution**: Update Knex configuration to use `client: 'mysql2'`.

---

## Rollback Instructions

If migration causes issues:

1. **Restore package.json**:
   ```bash
   git checkout HEAD -- package.json
   ```

2. **Reinstall old dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Restore code changes**:
   ```bash
   git checkout HEAD -- services/config.js
   git checkout HEAD -- plugins/
   ```

4. **Restart application**:
   ```bash
   pm2 restart ssmgr
   ```

---

## Verification Checklist

After migration, verify:

- [ ] Application starts without errors
- [ ] All API endpoints respond correctly
- [ ] Database connections work
- [ ] WebSocket connections establish
- [ ] User authentication functions
- [ ] Rate limiting is active
- [ ] Security headers are present
- [ ] No deprecation warnings in logs
- [ ] ESLint passes without errors
- [ ] Build process completes successfully

---

## Additional Resources

- [axios Documentation](https://axios-http.com/docs/intro)
- [js-yaml v4 Migration Guide](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md)
- [express-validator Documentation](https://express-validator.github.io/docs/)
- [mysql2 Documentation](https://github.com/sidorares/node-mysql2)
- [ESLint Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

---

**Last Updated**: 2024
**Applies to**: shadowsocks-manager v1.0.0+
