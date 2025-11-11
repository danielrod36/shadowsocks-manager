# Maintainer Publishing Checklist

## 🚨 Critical: These Security Fixes Need to be Published

The security fixes are currently **only in the repository**. Users installing from npm will still get the vulnerable version.

---

## ✅ Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass (or create basic tests)
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] Application starts without errors
- [ ] Basic functionality works (login, server management)
- [ ] Docker images build successfully
- [ ] Documentation is up to date

---

## 📦 Step 1: Publish to npm

### 1.1 Update Version Number

```bash
# Choose one based on semantic versioning:
npm version patch   # For bug fixes (1.0.0 -> 1.0.1)
npm version minor   # For new features (1.0.0 -> 1.1.0)
npm version major   # For breaking changes (1.0.0 -> 2.0.0)

# Recommended for this security update:
npm version major   # Because Node.js 18+ is required (breaking change)
```

This will:
- Update `package.json` version
- Create a git commit
- Create a git tag

### 1.2 Publish to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish

# Verify it was published
npm view shadowsocks-manager version
```

### 1.3 Verify the Published Package

```bash
# Install in a test directory
mkdir /tmp/test-ssmgr
cd /tmp/test-ssmgr
npm install shadowsocks-manager

# Check for vulnerabilities
npm audit

# Should show 0 vulnerabilities
```

---

## 🐳 Step 2: Update Docker Images

### 2.1 Build Docker Images

```bash
# Ubuntu image
cd docker/ubuntu
docker build -t gyteng/ssmgr:ubuntu-latest .
docker build -t gyteng/ssmgr:ubuntu-1.0.0 .

# Alpine image
cd ../alpine
docker build -t gyteng/ssmgr:alpine-latest .
docker build -t gyteng/ssmgr:alpine-1.0.0 .

# Default (Ubuntu)
cd ../..
docker build -t gyteng/ssmgr:latest -f docker/ubuntu/Dockerfile .
docker build -t gyteng/ssmgr:1.0.0 -f docker/ubuntu/Dockerfile .
```

### 2.2 Test Docker Images

```bash
# Test Ubuntu image
docker run --rm gyteng/ssmgr:latest --version

# Test Alpine image
docker run --rm gyteng/ssmgr:alpine-latest --version

# Test with config
docker run --name ssmgr-test -d \
  -v ~/.ssmgr:/root/.ssmgr \
  --net=host \
  gyteng/ssmgr:latest

# Check logs
docker logs ssmgr-test

# Cleanup
docker stop ssmgr-test
docker rm ssmgr-test
```

### 2.3 Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push all tags
docker push gyteng/ssmgr:latest
docker push gyteng/ssmgr:1.0.0
docker push gyteng/ssmgr:ubuntu-latest
docker push gyteng/ssmgr:ubuntu-1.0.0
docker push gyteng/ssmgr:alpine-latest
docker push gyteng/ssmgr:alpine-1.0.0
```

---

## 🏷️ Step 3: Create GitHub Release

### 3.1 Push Tags to GitHub

```bash
# Push the version tag created by npm version
git push origin main
git push origin --tags
```

### 3.2 Create GitHub Release

Go to: https://github.com/shadowsocks/shadowsocks-manager/releases/new

**Tag**: v1.0.0 (or whatever version you used)

**Title**: Security Update v1.0.0 - Critical Vulnerability Fixes

**Description**:
```markdown
## 🔒 Critical Security Update

This release fixes **4 CRITICAL security vulnerabilities**:

- **CVE-2021-3749, CVE-2023-45857**: axios RCE/SSRF vulnerabilities
- **CVE-2022-29078**: ejs Remote Code Execution
- **CVE-2021-35065**: js-yaml Code Injection
- **CVE-2021-32640, CVE-2024-37890**: ws Request Smuggling

## ⚠️ Breaking Changes

- **Node.js 18.0.0+ required** (Node.js 12 is EOL)
- Removed deprecated `request` and `request-promise` packages
- Updated major dependencies (see CHANGES_SUMMARY.md)

## ✨ New Features

- Added Helmet.js security headers
- Added rate limiting (5 login attempts per 15 min)
- Improved error handling and logging
- Updated Docker images (Ubuntu 22.04, Node.js 20)

## 📚 Documentation

- [URGENT_SECURITY_UPDATE.md](URGENT_SECURITY_UPDATE.md) - Quick start guide
- [SECURITY_UPGRADE_GUIDE.md](SECURITY_UPGRADE_GUIDE.md) - Complete upgrade instructions
- [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) - All changes made
- [CODE_MIGRATION_GUIDE.md](CODE_MIGRATION_GUIDE.md) - Developer migration guide
- [SECURITY.md](SECURITY.md) - Security policy

## 🚀 Upgrade Instructions

### From npm:
\`\`\`bash
npm update -g shadowsocks-manager
\`\`\`

### From source:
\`\`\`bash
git pull origin main
npm install
npm run build
\`\`\`

### Docker:
\`\`\`bash
docker pull gyteng/ssmgr:latest
\`\`\`

## ⚠️ Known Issues

- 4 plugin files still use deprecated `request` package (see TODO.md)
- Comprehensive testing needed (see TODO.md)

## 📊 Security Impact

- **Before**: 4 critical CVEs, 8+ high-severity issues
- **After**: 0 known vulnerabilities

**All users should upgrade immediately.**

## 🙏 Credits

Security fixes and documentation by the community.

---

**Full Changelog**: See [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)
```

### 3.3 Attach Files (Optional)

Consider attaching:
- SECURITY_UPGRADE_GUIDE.md
- CHANGES_SUMMARY.md
- CODE_MIGRATION_GUIDE.md

---

## 📢 Step 4: Announce the Release

### 4.1 Update README.md

Ensure README.md has the security notice (already done).

### 4.2 Create GitHub Discussion

Create a discussion post:
- Title: "Security Update v1.0.0 Released - Please Upgrade"
- Link to release notes
- Highlight critical nature

### 4.3 Notify Users (Optional)

Consider:
- Posting on project website
- Sending email to known users
- Posting on social media
- Creating a blog post

---

## 🔍 Step 5: Post-Release Verification

### 5.1 Verify npm Package

```bash
# Check npm shows latest version
npm view shadowsocks-manager

# Install and test
npm install -g shadowsocks-manager
ssmgr --version
npm audit  # Should show 0 vulnerabilities
```

### 5.2 Verify Docker Images

```bash
# Check Docker Hub
docker pull gyteng/ssmgr:latest
docker run --rm gyteng/ssmgr:latest --version
```

### 5.3 Monitor for Issues

- Watch GitHub issues for bug reports
- Monitor npm download stats
- Check for new security advisories

---

## 📋 Post-Publishing Tasks

After publishing, update TODO.md:

- [ ] Mark "Publish to npm" as completed
- [ ] Mark "Update Docker images" as completed
- [ ] Mark "Create GitHub release" as completed
- [ ] Start working on remaining tasks (request migration, testing)

---

## 🆘 Troubleshooting

### npm publish fails with "You do not have permission"

**Solution**: Ensure you're logged in as a maintainer:
```bash
npm whoami
npm owner ls shadowsocks-manager
```

### Docker push fails with "denied: requested access to the resource is denied"

**Solution**: Login to Docker Hub:
```bash
docker login
```

### Version already exists on npm

**Solution**: You can't republish the same version. Increment and try again:
```bash
npm version patch
npm publish
```

---

## 📞 Need Help?

- **npm Issues**: https://docs.npmjs.com/
- **Docker Issues**: https://docs.docker.com/
- **GitHub Releases**: https://docs.github.com/en/repositories/releasing-projects-on-github

---

## ✅ Quick Command Summary

```bash
# Complete publishing workflow
npm version major
npm publish
git push origin main --tags

# Build and push Docker
docker build -t gyteng/ssmgr:latest -f docker/ubuntu/Dockerfile .
docker push gyteng/ssmgr:latest

# Verify
npm view shadowsocks-manager version
docker pull gyteng/ssmgr:latest
```

---

**Status**: ⏳ Awaiting publication  
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 30-60 minutes  
**Impact**: Makes security fixes available to all users
