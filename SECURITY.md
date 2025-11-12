# Security Policy

## 🚨 IMMEDIATE ACTION REQUIRED - Security Update

> **⚠️ CRITICAL WARNING: NPM Package Not Updated**
> 
> **The npm package has NOT been updated yet and still contains vulnerabilities!**
> 
> **❌ Don't Use (Contains Vulnerabilities):**
> ```bash
> npm i -g shadowsocks-manager  # Still has 4 critical CVEs!
> ```
> 
> **✅ Use This Instead (Secure Version):**
> ```bash
> git clone https://github.com/shadowsocks/shadowsocks-manager.git
> cd shadowsocks-manager
> npm install
> npm run build
> node server.js
> ```

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Current Security Status

### Critical Vulnerabilities Fixed

This repository has been updated to fix **4 CRITICAL** security vulnerabilities that could allow:
- Remote Code Execution (RCE)
- Server-Side Request Forgery (SSRF)
- Code Injection
- Request Smuggling

| Vulnerability | Severity | Status |
|--------------|----------|--------|
| axios RCE/SSRF | CRITICAL | ✅ Fixed |
| ejs RCE | CRITICAL | ✅ Fixed |
| js-yaml Code Injection | CRITICAL | ✅ Fixed |
| ws Request Smuggling | HIGH | ✅ Fixed |
| Node.js 12 EOL | HIGH | ✅ Fixed |
| Deprecated packages | MEDIUM | ✅ Fixed |

### Deprecated Packages Removed

- **request** and **request-promise**: Replaced with axios (unmaintained since 2020)
- **babel-eslint**: Replaced with modern ESLint parser
- **mysql**: Replaced with mysql2 for better security and performance

## ⚡ Quick Security Upgrade (5 Minutes)

### Step 1: Check Your Node.js Version

```bash
node --version
```

**Required**: v18.0.0 or higher  
**Recommended**: v20.x.x (LTS)

If you have Node.js 12 or lower, **you must upgrade first**:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
nvm alias default 20
```

### Step 2: Backup Your Data

```bash
# Backup database
cp ~/.ssmgr/*.sqlite ~/.ssmgr/backup_$(date +%Y%m%d)/

# Backup config
cp ~/.ssmgr/*.yml ~/.ssmgr/backup_$(date +%Y%m%d)/
```

### Step 3: Update Dependencies

```bash
# Stop the service
pm2 stop ssmgr  # or your process manager

# Navigate to installation directory
cd /path/to/shadowsocks-manager

# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Step 4: Verify Security

```bash
# Check for vulnerabilities (should show 0)
npm audit

# Start the service
npm start
# or
pm2 start ssmgr
```

### Step 5: Test

```bash
# Test API
curl http://localhost:8080/api/home/login

# Check security headers
curl -I http://localhost:8080
```

## 📚 Complete Security Upgrade Guide

### Pre-Upgrade Checklist

- [ ] **Backup your database** (SQLite/MySQL)
- [ ] **Backup configuration files** (all .yml files)
- [ ] **Document current Node.js version**: `node --version`
- [ ] **Test in staging environment first** (if available)
- [ ] **Have rollback plan ready** (see below)
- [ ] **Schedule maintenance window** (recommended: 30-60 minutes)

### Critical Vulnerabilities Addressed

#### 1. **axios 0.21.1 → 1.7.9** (CRITICAL)
- **CVE-2021-3749**: Server-Side Request Forgery (SSRF)
- **CVE-2023-45857**: CSRF vulnerability
- **Impact**: Remote attackers could make unauthorized requests

#### 2. **ejs 2.7.4 → 3.1.10** (CRITICAL)
- **CVE-2022-29078**: Remote Code Execution (RCE)
- **Impact**: Attackers could execute arbitrary code on server

#### 3. **js-yaml 3.14.1 → 4.1.0** (CRITICAL)
- **CVE-2021-35065**: Code injection via load()
- **Impact**: Arbitrary code execution through YAML parsing

#### 4. **ws 6.2.1 → 8.18.0** (HIGH)
- **CVE-2021-32640**: ReDoS vulnerability
- **CVE-2024-37890**: Request smuggling
- **Impact**: Denial of service and potential security bypass

### Node.js Version Requirement

**Old**: Node.js 12.x (EOL: April 2022)  
**New**: Node.js 18.x LTS or 20.x LTS (minimum: 18.0.0)

### Upgrade Process

#### Step 1: Backup Everything

```bash
# Backup database
cp ~/.ssmgr/*.sqlite ~/.ssmgr/backup_$(date +%Y%m%d)/

# Backup config
cp -r ~/.ssmgr/*.yml ~/.ssmgr/backup_$(date +%Y%m%d)/

# Backup entire installation (if installed from source)
tar -czf ssmgr_backup_$(date +%Y%m%d).tar.gz /path/to/shadowsocks-manager
```

#### Step 2: Update Node.js

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

#### Step 3: Update Dependencies

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

#### Step 4: Verify Installation

```bash
# Check for vulnerabilities
npm audit

# Expected: 0 vulnerabilities (or only low-severity)

# Test the application
npm start

# In another terminal, test API
curl http://localhost:PORT/api/home
```

### Breaking Changes & Migration

#### 1. js-yaml API Changes

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

#### 2. axios API Changes

Most axios changes are backward compatible, but verify:
- Timeout behavior may differ
- Error handling structure unchanged
- Response interceptors work the same

#### 3. Express Validator Changes

If using custom validators, check the new API:
```javascript
// Old: express-validator 5.x
const { check } = require('express-validator/check');

// New: express-validator 7.x
const { check } = require('express-validator');
```

### Rollback Procedure

If issues occur after upgrade:

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

## 🔒 Security Features Added

- ✅ Helmet.js security headers
- ✅ Rate limiting (5 login attempts per 15 min)
- ✅ API rate limiting (100 requests per 15 min)
- ✅ Improved error handling
- ✅ Updated Docker images

## 📊 Before vs After

### Before
- 4 critical CVEs
- Node.js 12 (EOL)
- No rate limiting
- No security headers
- Deprecated packages

### After
- 0 vulnerabilities
- Node.js 18+ (LTS)
- Rate limiting enabled
- Security headers active
- Modern packages

## ⏱️ Estimated Time

- **Quick update**: 5-10 minutes
- **With testing**: 15-30 minutes
- **Full migration**: 1-2 hours (if using request package)

## 🚀 Production Deployment

1. **Test in staging first**
2. **Schedule maintenance window**
3. **Follow this security guide**
4. **Monitor logs for 24-48 hours**

## Reporting a Vulnerability

We take the security of shadowsocks-manager seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to the maintainer at `igyteng@gmail.com`
2. **GitHub Security Advisory**: Use the [GitHub Security Advisory](https://github.com/shadowsocks/shadowsocks-manager/security/advisories/new) feature

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** and how an attacker might exploit it
- **Any potential mitigations** you've identified

### What to Expect

After you submit a report, you can expect:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its severity within 7 days
3. **Updates**: We will keep you informed about our progress toward a fix
4. **Resolution**: We aim to release a fix within 30 days for critical vulnerabilities
5. **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

### Disclosure Policy

- **Coordinated Disclosure**: We follow a coordinated disclosure policy
- **Embargo Period**: We request a 90-day embargo period to develop and release a fix
- **Public Disclosure**: After the fix is released, we will publish a security advisory
- **CVE Assignment**: For critical vulnerabilities, we will request a CVE identifier

## Security Best Practices for Users

### Installation Security

1. **Always verify Node.js version**:
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Run security audit after installation**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Keep dependencies updated**:
   ```bash
   npm update
   npm outdated
   ```

### Configuration Security

1. **Use strong passwords**: Minimum 16 characters with mixed case, numbers, and symbols
2. **Change default secrets**: Update the session secret in your configuration
3. **Enable HTTPS**: Always use SSL/TLS in production
4. **Restrict CORS**: Only allow trusted domains in CORS configuration
5. **Use environment variables**: Never commit sensitive data to version control

### Deployment Security

1. **Run as non-root user**: Never run the application as root
   ```bash
   useradd -r -s /bin/false ssmgr
   sudo -u ssmgr ssmgr
   ```

2. **Use a reverse proxy**: Deploy behind nginx or Apache with proper security headers
   ```nginx
   # Example nginx configuration
   add_header X-Frame-Options "DENY";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
   ```

3. **Enable firewall**: Only expose necessary ports
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw deny 8080/tcp  # Don't expose app port directly
   ufw enable
   ```

4. **Regular backups**: Backup database and configuration files daily
   ```bash
   # Example backup script
   tar -czf backup-$(date +%Y%m%d).tar.gz ~/.ssmgr/
   ```

5. **Monitor logs**: Set up log monitoring and alerting
   ```bash
   tail -f ~/.ssmgr/logs/system.log
   ```

### Database Security

1. **Use strong database passwords**: Different from application passwords
2. **Restrict database access**: Only allow localhost connections
3. **Regular backups**: Automated daily backups with retention policy
4. **Encrypt sensitive data**: Use encryption for payment information

### Network Security

1. **Use VPN or private network**: For administrative access
2. **Enable rate limiting**: Already configured in the application
3. **DDoS protection**: Use Cloudflare or similar service
4. **IP whitelisting**: Restrict admin panel access by IP

## Security Features

### Built-in Security Measures

1. **Helmet.js**: Automatically sets secure HTTP headers
2. **Rate Limiting**: Protects against brute force attacks
   - API endpoints: 100 requests per 15 minutes
   - Authentication endpoints: 5 attempts per 15 minutes
3. **Session Security**: HTTP-only cookies with SameSite protection
4. **Input Validation**: Express-validator for all user inputs
5. **CORS Protection**: Configurable whitelist for cross-origin requests
6. **Compression**: Reduces bandwidth and improves performance
7. **Logging**: Comprehensive logging with log4js

### Recommended Additional Security

1. **Two-Factor Authentication**: Consider implementing 2FA for admin accounts
2. **Intrusion Detection**: Use fail2ban or similar tools
3. **Security Scanning**: Regular vulnerability scans with tools like:
   - `npm audit`
   - OWASP ZAP
   - Snyk
   - GitHub Dependabot

## Security Checklist

Before deploying to production, ensure:

- [ ] Node.js version is 18.0.0 or higher
- [ ] All dependencies are up to date (`npm update`)
- [ ] No security vulnerabilities (`npm audit` shows 0 vulnerabilities)
- [ ] Strong passwords configured for all accounts
- [ ] Session secret changed from default
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured to restrict access
- [ ] Application running as non-root user
- [ ] Database backups configured and tested
- [ ] Log monitoring and alerting set up
- [ ] CORS properly configured for your domain
- [ ] Rate limiting enabled (default configuration)
- [ ] Security headers enabled via Helmet.js
- [ ] Regular update schedule established

## Vulnerability Disclosure Timeline

When we receive a security report:

| Day | Action |
|-----|--------|
| 0 | Vulnerability reported |
| 1-2 | Acknowledgment sent to reporter |
| 3-7 | Vulnerability assessed and severity determined |
| 7-30 | Fix developed and tested |
| 30 | Security patch released |
| 30+ | Public disclosure and security advisory published

## Past Security Advisories

### 2024 Security Updates

**Critical Dependency Updates (2024)**
- **Severity**: Critical
- **Affected Versions**: All versions prior to 1.0.0
- **Fixed In**: 1.0.0+
- **Description**: Multiple critical vulnerabilities in dependencies (axios, ejs, js-yaml, ws)
- **Mitigation**: Update to latest version and run `npm audit fix`

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [
