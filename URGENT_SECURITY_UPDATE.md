# 🚨 IMMEDIATE ACTION REQUIRED - Security Update

> 📚 **Looking for other docs?** See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for complete documentation guide.

## ⚠️ CRITICAL WARNING: NPM Package Not Updated

**🚨 The npm package has NOT been updated yet and still contains vulnerabilities!**

### ❌ Don't Use (Contains Vulnerabilities):
```bash
npm i -g shadowsocks-manager  # Still has 4 critical CVEs!
```

### ✅ Use This Instead (Secure Version):
```bash
git clone https://github.com/shadowsocks/shadowsocks-manager.git
cd shadowsocks-manager
npm install
npm run build
node server.js
```

## Critical Security Vulnerabilities Fixed

This repository has been updated to fix **4 CRITICAL** security vulnerabilities that could allow:
- Remote Code Execution (RCE)
- Server-Side Request Forgery (SSRF)
- Code Injection
- Request Smuggling

## ⚡ Quick Start (5 Minutes)

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

## ✅ What's Fixed

| Vulnerability | Severity | Status |
|--------------|----------|--------|
| axios RCE/SSRF | CRITICAL | ✅ Fixed |
| ejs RCE | CRITICAL | ✅ Fixed |
| js-yaml Code Injection | CRITICAL | ✅ Fixed |
| ws Request Smuggling | HIGH | ✅ Fixed |
| Node.js 12 EOL | HIGH | ✅ Fixed |
| Deprecated packages | MEDIUM | ✅ Fixed |

## 📚 Full Documentation

- **[SECURITY_UPGRADE_GUIDE.md](SECURITY_UPGRADE_GUIDE.md)** - Complete upgrade instructions
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - All changes made
- **[CODE_MIGRATION_GUIDE.md](CODE_MIGRATION_GUIDE.md)** - Code migration help
- **[SECURITY.md](SECURITY.md)** - Security policy

## ⚠️ Breaking Changes

1. **Node.js 18+ required** (was 12.x)
2. **request package removed** - 4 plugin files need migration
3. **js-yaml API changed** - Already fixed in core

## 🆘 Need Help?

- **Issues**: https://github.com/shadowsocks/shadowsocks-manager/issues
- **Security**: igyteng@gmail.com
- **Documentation**: See files above

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
3. **Follow SECURITY_UPGRADE_GUIDE.md**
4. **Monitor logs for 24-48 hours**

---

**Status**: ✅ Ready to deploy  
**Priority**: 🔴 CRITICAL  
**Action**: Update immediately  
**Risk if not updated**: Remote code execution, data breach
