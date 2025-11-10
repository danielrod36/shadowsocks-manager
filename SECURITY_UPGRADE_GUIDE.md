# Security Upgrade Guide for shadowsocks-manager

## ⚠️ CRITICAL: Read Before Upgrading

This guide addresses critical security vulnerabilities in shadowsocks-manager. Follow these steps carefully to ensure a safe upgrade process.

## Pre-Upgrade Checklist

- [ ] **Backup your database** (SQLite/MySQL)
- [ ] **Backup configuration files** (all .yml files)
- [ ] **Document current Node.js version**: `node --version`
- [ ] **Test in staging environment first** (if available)
- [ ] **Have rollback plan ready** (see below)
- [ ] **Schedule maintenance window** (recommended: 30-60 minutes)

## Critical Vulnerabilities Addressed

### 1. **axios 0.21.1 → 1.7.9** (CRITICAL)
- **CVE-2021-3749**: Server-Side Request Forgery (SSRF)
- **CVE-2023-45857**: CSRF vulnerability
- **Impact**: Remote attackers could make unauthorized requests

### 2. **ejs 2.7.4 → 3.1.10** (CRITICAL)
- **CVE-2022-29078**: Remote Code Execution (RCE)
- **Impact**: Attackers could execute arbitrary code on server

### 3. **js-yaml 3.14.1 → 4.1.0** (CRITICAL)
- **CVE-2021-35065**: Code injection via load()
- **Impact**: Arbitrary code execution through YAML parsing

### 4. **ws 6.2.1 → 8.18.0** (HIGH)
- **CVE-2021-32640**: ReDoS vulnerability
- **CVE-2024-37890**: Request smuggling
- **Impact**: Denial of service and potential security bypass

### 5. **request (deprecated)** → **axios** (CRITICAL)
- Package unmaintained since 2020
- Multiple unpatched vulnerabilities
- **Action**: Replaced with axios in code

## Node.js Version Requirement

**Old**: Node.js 12.x (EOL: April 2022)  
**New**: Node.js 18.x LTS or 20.x LTS (minimum: 18.0.0)

### Why Upgrade Node.js?
- Security patches no longer available for Node.js 12
- Better performance and modern JavaScript features
- Required for updated dependencies

## Upgrade Process

### Step 1: Backup Everything

```bash
# Backup database
cp ~/.ssmgr/*.sqlite ~/.ssmgr/backup_$(date +%Y%m%d)/

# Backup config
cp -r ~/.ssmgr/*.yml ~/.ssmgr/backup_$(date +%Y%m%d)/

# Backup entire installation (if installed from source)
tar -czf ssmgr_backup_$(date +%Y%m%d).tar.gz /path/to/shadowsocks-manager
```

### Step 2: Update Node.js

**Using nvm (recommended):**
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

**Using package manager:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### Step 3: Update Dependencies

**Option A: Fresh Install (Recommended)**
```bash
# Stop the service
pm2 stop ssmgr  # or your process manager

# Navigate to installation directory
cd /path/to/shadowsocks-manager

# Remove old dependencies
rm -rf node_modules
rm package-lock.json  # if exists

# Pull latest changes (if using git)
git pull origin master

# Install updated dependencies
npm install

# Rebuild native modules
npm rebuild

# Build frontend assets
npm run build
```

**Option B: In-Place Update**
```bash
# Stop the service
pm2 stop ssmgr

# Update dependencies
npm update

# Install new security packages
npm install helmet@^8.0.0 express-rate-limit@^7.0.0

# Rebuild and restart
npm run build
pm2 start ssmgr
```

### Step 4: Verify Installation

```bash
# Check for vulnerabilities
npm audit

# Expected: 0 vulnerabilities (or only low-severity)

# Test the application
npm start

# In another terminal, test API
curl http://localhost:PORT/api/home
```

### Step 5: Update Configuration (if needed)

Some dependencies have breaking changes. Check your configuration:

**js-yaml 4.x changes:**
- `yaml.load()` is now `yaml.load(input, { schema: yaml.DEFAULT_SCHEMA })`
- `yaml.safeLoad()` is deprecated, use `yaml.load()` instead

**knex 3.x changes:**
- Connection string format may differ
- Check database connection configuration

## Breaking Changes & Migration

### 1. js-yaml API Changes

**Before (v3):**
```javascript
const yaml = require('js-yaml');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
```

**After (v4):**
```javascript
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
```

### 2. axios API Changes

Most axios changes are backward compatible, but verify:
- Timeout behavior may differ
- Error handling structure unchanged
- Response interceptors work the same

### 3. Express Validator Changes

If using custom validators, check the new API:
```javascript
// Old: express-validator 5.x
const { check } = require('express-validator/check');

// New: express-validator 7.x
const { check } = require('express-validator');
```

## Rollback Procedure

If issues occur after upgrade:

### Quick Rollback

```bash
# Stop the service
pm2 stop ssmgr

# Restore from backup
cd /path/to/shadowsocks-manager
rm -rf node_modules
tar -xzf ssmgr_backup_YYYYMMDD.tar.gz

# Restore database
cp ~/.ssmgr/backup_YYYYMMDD/*.sqlite ~/.ssmgr/

# Restore config
cp ~/.ssmgr/backup_YYYYMMDD/*.yml ~/.ssmgr/

# Downgrade Node.js (if needed)
nvm use 12  # or your previous version

# Reinstall old dependencies
npm install

# Restart
pm2 start ssmgr
```

### Verify Rollback

```bash
# Check service status
pm2 status

# Check logs
pm2 logs ssmgr

# Test API
curl http://localhost:PORT/api/home
```

## Post-Upgrade Monitoring

Monitor these for 24-48 hours after upgrade:

1. **Application Logs**
   ```bash
   pm2 logs ssmgr --lines 100
   tail -f ~/.ssmgr/logs/system.log
   ```

2. **Error Rates**
   - Check for increased error responses
   - Monitor WebSocket connections
   - Verify user authentication works

3. **Performance Metrics**
   - CPU usage should be similar or better
   - Memory usage may increase slightly (Node.js 20)
   - Response times should be comparable

4. **Database Connections**
   - Verify no connection pool issues
   - Check for query errors in logs

## Security Hardening (Post-Upgrade)

After successful upgrade, implement these security measures:

### 1. Enable Security Headers

The upgrade includes helmet.js. Verify it's active:
```bash
curl -I http://localhost:PORT
# Should see headers like:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
```

### 2. Enable Rate Limiting

Check rate limiting is working:
```bash
# Make multiple rapid requests
for i in {1..20}; do curl http://localhost:PORT/api/login; done
# Should see 429 Too Many Requests after threshold
```

### 3. Update Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow YOUR_SSMGR_PORT/tcp
sudo ufw enable
```

### 4. Enable HTTPS

Use Let's Encrypt for free SSL certificates:
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Native module compilation fails

**Solution:**
```bash
# Install build tools
sudo apt-get install build-essential python3

# Rebuild native modules
npm rebuild
```

### Issue: Database connection errors

**Solution:**
```bash
# Check database file permissions
ls -la ~/.ssmgr/*.sqlite

# Verify knex configuration
node -e "const knex = require('knex'); console.log(knex.VERSION);"
```

### Issue: WebSocket connections fail

**Solution:**
```bash
# Check ws module version
npm list ws

# Verify no proxy interference
curl -I --http1.1 -H "Upgrade: websocket" http://localhost:PORT
```

### Issue: High memory usage after upgrade

**Solution:**
```bash
# Node.js 20 uses more memory but is more efficient
# Adjust PM2 max memory if needed
pm2 start server.js --max-memory-restart 500M
```

## Testing Checklist

After upgrade, verify these functions:

- [ ] User login/authentication works
- [ ] Account creation and management
- [ ] Traffic monitoring and statistics
- [ ] Payment processing (if enabled)
- [ ] Email notifications
- [ ] WebSocket real-time updates
- [ ] Admin panel access
- [ ] API endpoints respond correctly
- [ ] Database queries execute without errors
- [ ] Shadowsocks server connections work

## Support & Reporting Issues

If you encounter issues during upgrade:

1. **Check logs first:**
   ```bash
   pm2 logs ssmgr --err --lines 50
   ```

2. **Run diagnostics:**
   ```bash
   npm audit
   node --version
   npm list --depth=0
   ```

3. **Report issues:**
   - GitHub Issues: https://github.com/shadowsocks/shadowsocks-manager/issues
   - Include: Node.js version, OS, error logs, steps to reproduce

## Security Best Practices

After upgrade, maintain security:

1. **Regular Updates**
   ```bash
   # Check for updates monthly
   npm outdated
   npm audit
   ```

2. **Monitor Security Advisories**
   - Subscribe to GitHub security alerts
   - Follow Node.js security releases

3. **Automated Backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

4. **Access Control**
   - Use strong passwords
   - Enable 2FA where possible
   - Limit admin access by IP

5. **Logging & Monitoring**
   - Enable detailed logging
   - Set up log rotation
   - Monitor for suspicious activity

## Timeline Recommendation

- **Week 1**: Test in staging/development environment
- **Week 2**: Schedule production upgrade during low-traffic period
- **Week 3-4**: Monitor and fine-tune

## Additional Resources

- Node.js LTS Schedule: https://nodejs.org/en/about/releases/
- npm Security Best Practices: https://docs.npmjs.com/security-best-practices
- Express Security Guide: https://expressjs.com/en/advanced/best-practice-security.html

---

**Last Updated**: 2024
**Applies to**: shadowsocks-manager v1.0.0+
**Minimum Node.js**: 18.0.0
**Recommended Node.js**: 20.x LTS
