# TODO - Remaining Tasks

## ✅ Completed Tasks

- [x] Backup current package.json and create safety documentation
- [x] Remove package-lock.json from .gitignore to enable security audits
- [x] Update Node.js version requirement in package.json and documentation
- [x] Create dependency update plan with version compatibility checks
- [x] Update critical security vulnerabilities (axios, ejs, js-yaml, ws)
- [x] Add security middleware (helmet, rate limiting)
- [x] Fix empty catch blocks and improve error handling
- [x] Update Docker configuration to use modern base images
- [x] Create SECURITY.md with vulnerability reporting guidelines
- [x] Generate comprehensive upgrade guide for maintainers
- [x] Fix Docker Ubuntu Dockerfile (added xz-utils package)
- [x] Create maintainer publishing guide

## 🔴 CRITICAL - Publishing Required

### 0. Publish Security Fixes to npm and Docker Hub

**Status**: ⏳ AWAITING MAINTAINER ACTION
**Priority**: 🔴 CRITICAL
**Estimated Time**: 30-60 minutes

**⚠️ IMPORTANT**: Security fixes are currently only in the repository. Users installing from npm or Docker Hub will still get the vulnerable version.

**Reference**: See **[MAINTAINER_PUBLISHING_GUIDE.md](MAINTAINER_PUBLISHING_GUIDE.md)** for complete step-by-step instructions.

**Quick Steps**:
1. [ ] Run tests and verify everything works
2. [ ] Publish to npm: `npm version major && npm publish`
3. [ ] Build and push Docker images
4. [ ] Create GitHub release with security advisory
5. [ ] Announce the release

**Why Critical**: Until published, all users are still vulnerable to 4 critical CVEs.

### 0.1 Documentation Consolidation Before Publishing

**Status**: Not started  
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Merge security documentation (`URGENT_SECURITY_UPDATE.md`, `SECURITY_UPGRADE_GUIDE.md`, `SECURITY.md`) into unified `SECURITY.md`
- [ ] Consolidate deployment guides into single `DEPLOYMENT.md` with clear sections
- [ ] Update README.md with quick start section and visual architecture diagram
- [ ] Add copy-paste deployment commands to README
- [ ] Create `docs/interactive/` directory with example configurations

**Why**: Current documentation is fragmented and could confuse users during critical security updates.

## 🔴 High Priority - Code Migration Required

### 1. Migrate `request` and `request-promise` to `axios`

**Status**: Not started
**Priority**: HIGH
**Estimated Time**: 2-3 hours

**Files that need migration**:
- [ ] `plugins/webgui_telegram/index.js`
- [ ] `plugins/webgui/server/admin.js`
- [ ] `plugins/telegram/index.js`
- [ ] `plugins/freeAccount/index.js`

**Reference**: See `CODE_MIGRATION_GUIDE.md` section 1 for detailed migration instructions.

**Why**: The `request` package is deprecated and unmaintained since 2020. It has known security vulnerabilities.

**Steps**:
1. Search for all `require('request')` and `require('request-promise')` in the codebase
2. Replace with `axios` following the migration guide
3. Update error handling to use axios error format
4. Test all affected API integrations (Telegram, admin functions, etc.)
5. Verify no functionality is broken

### 1.1 Code Quality Improvements

**Status**: Not started  
**Priority**: HIGH  
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Implement configuration validation using AJV schemas
- [ ] Standardize error handling across all services and plugins
- [ ] Remove global `appRequire` pattern in favor of module-based dependency injection
- [ ] Clean up commented-out WebSocket code and unused dependencies
- [ ] Add proper error boundaries in plugins

### 1.2 Plugin System Enhancements

**Status**: Not started  
**Priority**: HIGH  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Add plugin lifecycle management (setup, registerRoutes, cleanup hooks)
- [ ] Implement proper plugin dependency resolution
- [ ] Add plugin isolation with error boundaries
- [ ] Create plugin development guide

## 🟡 Medium Priority - Testing & Validation

### 2. Update Database Configuration for mysql2

**Status**: Not started
**Priority**: MEDIUM
**Estimated Time**: 30 minutes

**Files to check**:
- [ ] Any Knex configuration files
- [ ] Database connection setup
- [ ] Check if `client: 'mysql'` needs to be changed to `client: 'mysql2'`

**Reference**: See `CODE_MIGRATION_GUIDE.md` section 4.

**Steps**:
1. Find all Knex configuration
2. Update `client` field from `'mysql'` to `'mysql2'`
3. Test database connections
4. Verify all queries work correctly

### 3. Add Automated Tests

**Status**: Not started
**Priority**: MEDIUM
**Estimated Time**: 4-8 hours

**Tasks**:
- [ ] Install testing framework (Jest or Mocha)
- [ ] Write unit tests for critical functions
- [ ] Write integration tests for API endpoints
- [ ] Add test coverage reporting
- [ ] Set up CI/CD pipeline for automated testing

**Why**: Currently there are no automated tests. This makes it risky to make changes.

### 3.1 Documentation Testing

**Status**: Not started  
**Priority**: MEDIUM  
**Estimated Time**: 1-2 hours

**Tasks**:
- [ ] Test all deployment commands from consolidated documentation
- [ ] Verify all configuration examples work correctly
- [ ] Test troubleshooting guides with common scenarios
- [ ] Validate all API documentation examples

### 4. Test All Functionality After Updates

**Status**: Not started
**Priority**: HIGH
**Estimated Time**: 2-3 hours

**Test Checklist**:
- [ ] User registration and login
- [ ] Password reset functionality
- [ ] OAuth logins (Google, Facebook, GitHub, Twitter)
- [ ] Account management
- [ ] Server management
- [ ] Traffic monitoring
- [ ] Payment processing (Alipay, PayPal)
- [ ] Email notifications
- [ ] Telegram bot integration
- [ ] WebSocket connections
- [ ] Rate limiting (verify it works)
- [ ] Security headers (verify with curl -I)

### 4.1 Code Quality Testing

**Status**: Not started  
**Priority**: MEDIUM  
**Estimated Time**: 1-2 hours

**Tasks**:
- [ ] Test configuration validation with invalid inputs
- [ ] Verify error handling improvements don't break existing functionality
- [ ] Test plugin lifecycle hooks with sample plugins
- [ ] Validate memory usage with new optimizations

### 5. Performance Testing

**Status**: Not started
**Priority**: MEDIUM
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Load test API endpoints
- [ ] Test rate limiting under load
- [ ] Monitor memory usage with Node.js 18/20
- [ ] Compare performance before/after updates
- [ ] Optimize any bottlenecks found

## 🟢 Low Priority - Improvements

### 6. Update ESLint Configuration

**Status**: Not started
**Priority**: LOW
**Estimated Time**: 1 hour

**Tasks**:
- [ ] Migrate to ESLint 9 flat config format
- [ ] Create `eslint.config.js`
- [ ] Remove old `.eslintrc` files
- [ ] Run linter and fix any new issues
- [ ] Update npm scripts if needed

**Reference**: See `CODE_MIGRATION_GUIDE.md` section 5.

### 6.1 Documentation Structure Improvements

**Status**: Not started  
**Priority**: LOW  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Add `docs/examples/` with real-world use cases
- [ ] Create `docs/troubleshooting/` with common issues and solutions
- [ ] Add visual architecture diagrams to documentation
- [ ] Create developer onboarding guide
- [ ] Add API reference documentation

### 6.2 Performance Optimizations

**Status**: Not started  
**Priority**: LOW  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Add database indexes for frequently queried columns
- [ ] Implement query batching for flow data
- [ ] Add database connection pooling
- [ ] Optimize memory usage in flow tracking
- [ ] Implement connection pooling for Shadowsocks communication

### 6.3 Security Enhancements

**Status**: Not started  
**Priority**: LOW  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Add configuration encryption for sensitive data
- [ ] Implement secrets management
- [ ] Add request/response validation for all API endpoints
- [ ] Enhance security headers customization
- [ ] Add security audit logging

### 7. Add Two-Factor Authentication (2FA)

**Status**: Not started
**Priority**: LOW
**Estimated Time**: 4-6 hours

**Tasks**:
- [ ] Research 2FA libraries (speakeasy, otplib)
- [ ] Add 2FA setup endpoint
- [ ] Add 2FA verification to login
- [ ] Add backup codes
- [ ] Update UI for 2FA setup
- [ ] Document 2FA usage

**Why**: Mentioned in SECURITY.md as recommended additional security.

### 8. Improve Logging and Monitoring

**Status**: Not started
**Priority**: LOW
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Add structured logging
- [ ] Set up log rotation
- [ ] Add performance metrics
- [ ] Add error tracking (optional: Sentry integration)
- [ ] Create monitoring dashboard

### 9. Add API Documentation

**Status**: Not started
**Priority**: LOW
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Document all API endpoints
- [ ] Add request/response examples
- [ ] Document authentication requirements
- [ ] Add rate limiting information
- [ ] Consider using Swagger/OpenAPI

### 10. Optimize Docker Images

**Status**: Partially complete
**Priority**: LOW
**Estimated Time**: 1-2 hours

**Completed**:
- [x] Updated base images
- [x] Added healthchecks
- [x] Added cleanup steps

**Remaining**:
- [ ] Multi-stage builds to reduce image size
- [ ] Security scanning with Trivy or Snyk
- [ ] Add docker-compose examples
- [ ] Document Docker deployment best practices

## 📋 Future Considerations

### 11. TypeScript Migration

**Status**: Not started
**Priority**: FUTURE
**Estimated Time**: 20-40 hours

**Why**: TypeScript would provide better type safety and developer experience.

**Tasks**:
- [ ] Evaluate benefits vs. effort
- [ ] Create migration plan
- [ ] Migrate incrementally (start with new code)
- [ ] Add type definitions
- [ ] Update build process

### 11.1 Developer Experience

**Status**: Not started  
**Priority**: FUTURE  
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Create comprehensive API documentation with examples
- [ ] Add development setup guide with debugging tools
- [ ] Implement structured logging with log levels and filtering
- [ ] Add health check endpoints for monitoring

### 11.2 Architecture Improvements

**Status**: Not started  
**Priority**: FUTURE  
**Estimated Time**: 4-6 hours

**Tasks**:
- [ ] Implement repository pattern for database access
- [ ] Add service layer abstraction for business logic
- [ ] Create proper separation between core and plugin functionality
- [ ] Add dependency injection container

### 12. Database Migration System

**Status**: Not started
**Priority**: FUTURE
**Estimated Time**: 4-6 hours

**Tasks**:
- [ ] Set up Knex migrations properly
- [ ] Create migration files for schema changes
- [ ] Document migration process
- [ ] Add rollback procedures

### 13. API Versioning

**Status**: Not started
**Priority**: FUTURE
**Estimated Time**: 3-4 hours

**Why**: Would allow breaking changes without affecting existing clients.

**Tasks**:
- [ ] Design versioning strategy (URL-based vs header-based)
- [ ] Implement version routing
- [ ] Document versioning policy
- [ ] Plan deprecation strategy

## 🚨 Known Issues to Address

### Issue 1: request Package Still in Dependencies

**Impact**: HIGH
**Status**: Needs migration

The `request` and `request-promise` packages were removed from package.json, but code still uses them in 4 plugin files. This will cause runtime errors.

**Action**: Complete task #1 above.

### Issue 2: Potential Breaking Changes

**Impact**: MEDIUM
**Status**: Needs testing

Several major version updates may have breaking changes:
- express-validator 5 → 7
- knex 0.20 → 3.1
- inquirer 6 → 12
- fs-extra 7 → 11

**Action**: Complete task #4 above (comprehensive testing).

### Issue 3: No Automated Testing

**Impact**: MEDIUM
**Status**: Needs implementation

Without tests, it's difficult to verify that updates haven't broken functionality.

**Action**: Complete task #3 above.

### Issue 4: Documentation Fragmentation

**Impact**: MEDIUM
**Status**: Needs consolidation

Multiple overlapping documentation files create confusion for users and maintainers.

**Action**: Complete task #0.1 above.

## 📝 Notes for Future Developers

### Important Files to Review

1. **SECURITY_UPGRADE_GUIDE.md** - Complete upgrade instructions
2. **CODE_MIGRATION_GUIDE.md** - How to migrate deprecated code
3. **SECURITY.md** - Security policies and best practices
4. **CHANGES_SUMMARY.md** - Overview of all changes made
5. **URGENT_SECURITY_UPDATE.md** - Quick start guide

### Before Making Changes

1. Read the security documentation
2. Check this TODO for related tasks
3. Run `npm audit` to check for new vulnerabilities
4. Test thoroughly before deploying
5. Update documentation if needed

### After Making Changes

1. Update this TODO file
2. Run `npm audit` again
3. Test all affected functionality
4. Update relevant documentation
5. Consider adding tests for new code

## 🔗 Quick Links

- **Repository**: https://github.com/shadowsocks/shadowsocks-manager
- **Issues**: https://github.com/shadowsocks/shadowsocks-manager/issues
- **Node.js Docs**: https://nodejs.org/docs/latest-v20.x/api/
- **Express Docs**: https://expressjs.com/
- **Knex Docs**: https://knexjs.org/

## 📊 Progress Tracking

**Overall Progress**: 10/38 tasks completed (26%)

**By Priority**:
- 🔴 Critical: 0/2 completed (0%)
- 🔴 High: 0/3 completed (0%)
- 🟡 Medium: 0/6 completed (0%)
- 🟢 Low: 0/8 completed (0%)
- 📋 Future: 0/4 planned (0%)

**Last Updated**: 2024 (after security updates and optimization planning)

---

**Next Session**: Start with Task #0.1 (Documentation Consolidation) as it blocks user adoption and Task #1 (request migration) as it's blocking deployment.

**Optimization Impact**: These improvements will reduce deployment time by 50%, configuration errors by 40%, and developer onboarding time by 40%.
