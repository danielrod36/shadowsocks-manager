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

## 🟡 Medium Priority - Testing & Validation

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

**Overall Progress**: 10/23 tasks completed (43%)

**By Priority**:
- 🔴 High: 0/2 completed (0%)
- 🟡 Medium: 0/3 completed (0%)
- 🟢 Low: 0/5 completed (0%)
- 📋 Future: 0/3 planned (0%)

**Last Updated**: 2024 (after security updates)

---

**Next Session**: Start with Task #1 (migrate request to axios) as it's the highest priority and blocking deployment.
