# ✅ Maintainer Quick Checklist

## 🚨 CRITICAL: Security Fixes Need Publishing

**Status**: ⏳ Awaiting your action  
**Priority**: 🔴 CRITICAL  
**Time Required**: 30-60 minutes

---

## Pre-Flight Checklist

Before publishing, verify:

- [ ] Application starts without errors
  ```bash
  npm install
  npm run build
  node server.js
  ```

- [ ] No vulnerabilities found
  ```bash
  npm audit
  # Should show: "found 0 vulnerabilities"
  ```

- [ ] Basic functionality works
  - [ ] Can access web interface
  - [ ] Can login
  - [ ] Can view servers

- [ ] Docker images build successfully
  ```bash
  docker build -t test -f docker/ubuntu/Dockerfile .
  docker build -t test -f docker/alpine/Dockerfile .
  ```

---

## Publishing Steps

### ☑️ Step 1: Publish to npm (10 minutes)

```bash
# 1. Update version (choose one)
npm version major    # 1.0.0 (recommended - breaking changes)
# npm version minor  # 0.x.0 (new features)
# npm version patch  # 0.0.x (bug fixes)

# 2. Login to npm (if needed)
npm login

# 3. Publish
npm publish

# 4. Verify
npm view shadowsocks-manager version
```

**Expected Result**: New version visible on npm

---

### ☑️ Step 2: Push to GitHub (2 minutes)

```bash
# Push code and tags
git push origin main
git push origin --tags
```

**Expected Result**: New tag visible on GitHub

---

### ☑️ Step 3: Build Docker Images (15 minutes)

```bash
# Ubuntu images
docker build -t gyteng/ssmgr:latest -f docker/ubuntu/Dockerfile .
docker build -t gyteng/ssmgr:ubuntu-latest -f docker/ubuntu/Dockerfile .
docker build -t gyteng/ssmgr:1.0.0 -f docker/ubuntu/Dockerfile .

# Alpine images
docker build -t gyteng/ssmgr:alpine-latest -f docker/alpine/Dockerfile .
docker build -t gyteng/ssmgr:alpine-1.0.0 -f docker/alpine/Dockerfile .
```

**Expected Result**: 5 Docker images built successfully

---

### ☑️ Step 4: Push Docker Images (10 minutes)

```bash
# Login to Docker Hub
docker login

# Push all images
docker push gyteng/ssmgr:latest
docker push gyteng/ssmgr:ubuntu-latest
docker push gyteng/ssmgr:1.0.0
docker push gyteng/ssmgr:alpine-latest
docker push gyteng/ssmgr:alpine-1.0.0
```

**Expected Result**: Images visible on Docker Hub

---

### ☑️ Step 5: Create GitHub Release (10 minutes)

1. Go to: https://github.com/shadowsocks/shadowsocks-manager/releases/new

2. Fill in:
   - **Tag**: v1.0.0 (or your version)
   - **Title**: Security Update v1.0.0 - Critical Vulnerability Fixes
   - **Description**: Copy from template below

3. Click "Publish release"

**Release Description Template**:
```markdown
## 🔒 Critical Security Update

This release fixes **4 CRITICAL security vulnerabilities**:

- **CVE-2021-3749, CVE-2023-45857**: axios RCE/SSRF
- **CVE-2022-29078**: ejs Remote Code Execution
- **CVE-2021-35065**: js-yaml Code Injection
- **CVE-2021-32640, CVE-2024-37890**: ws Request Smuggling

## ⚠️ Breaking Changes

- **Node.js 18.0.0+ required** (Node.js 12 is EOL)
- Removed deprecated packages (request, request-promise, mysql)

## ✨ New Features

- Added Helmet.js security headers
- Added rate limiting
- Improved error handling
- Updated Docker images

## 🚀 Upgrade Instructions

**From npm**:
\`\`\`bash
npm update -g shadowsocks-manager
\`\`\`

**From Docker**:
\`\`\`bash
docker pull gyteng/ssmgr:latest
\`\`\`

**From source**:
\`\`\`bash
git pull origin main
npm install
npm run build
\`\`\`

## 📚 Documentation

- [URGENT_SECURITY_UPDATE.md](URGENT_SECURITY_UPDATE.md)
- [SECURITY_UPGRADE_GUIDE.md](SECURITY_UPGRADE_GUIDE.md)
- [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

**All users should upgrade immediately.**
```

---

### ☑️ Step 6: Verify Everything (5 minutes)

```bash
# Test npm package
npm install -g shadowsocks-manager
ssmgr --version
npm audit  # Should show 0 vulnerabilities

# Test Docker image
docker pull gyteng/ssmgr:latest
docker run --rm gyteng/ssmgr:latest --version

# Check GitHub release
# Visit: https://github.com/shadowsocks/shadowsocks-manager/releases
```

**Expected Result**: All working, no vulnerabilities

---

### ☑️ Step 7: Announce (5 minutes)

- [ ] Create GitHub Discussion announcing the release
- [ ] Update project website (if applicable)
- [ ] Post on social media (if applicable)
- [ ] Email known users (if applicable)

---

## Post-Publishing Tasks

After publishing:

- [ ] Update TODO.md to mark publishing tasks as complete
- [ ] Monitor GitHub issues for bug reports
- [ ] Watch npm download stats
- [ ] Check for new security advisories

---

## Troubleshooting

### "npm publish" fails with permission error
**Solution**: Run `npm login` and ensure you're a package maintainer

### Docker push fails
**Solution**: Run `docker login` with correct credentials

### Version already exists
**Solution**: Can't republish same version. Run `npm version patch` and try again

---

## Need Help?

**Detailed Instructions**: See [MAINTAINER_PUBLISHING_GUIDE.md](MAINTAINER_PUBLISHING_GUIDE.md)

**Questions**: Open a GitHub issue or discussion

---

## Summary

**What you're publishing**:
- ✅ 4 critical CVE fixes
- ✅ 15+ dependency updates
- ✅ Security middleware
- ✅ Updated Docker images
- ✅ Comprehensive documentation

**Impact**:
- Makes security fixes available to all users
- Removes 4 critical vulnerabilities
- Updates from EOL Node.js 12 to LTS 18+

**Time**: 30-60 minutes total

**Priority**: 🔴 CRITICAL - Do this ASAP

---

**Ready?** Start with Step 1 above! 🚀
