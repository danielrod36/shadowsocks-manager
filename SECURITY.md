# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Updates

### Current Security Status

As of the latest update, we have addressed the following critical vulnerabilities:

- **axios**: Updated to 1.7.9+ (fixes CVE-2021-3749, CVE-2023-45857)
- **ejs**: Updated to 3.1.10+ (fixes CVE-2022-29078 RCE vulnerability)
- **js-yaml**: Updated to 4.1.0+ (fixes CVE-2021-35065 code injection)
- **ws**: Updated to 8.18.0+ (fixes CVE-2021-32640, CVE-2024-37890)
- **Node.js**: Minimum version 18.0.0 (Node.js 12 reached EOL)

### Deprecated Packages Removed

- **request** and **request-promise**: Replaced with axios (unmaintained since 2020)
- **babel-eslint**: Replaced with modern ESLint parser
- **mysql**: Replaced with mysql2 for better security and performance

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
| 30+ | Public disclosure and security advisory published |

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
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## Contact

For security-related questions or concerns:

- **Email**: igyteng@gmail.com
- **GitHub Issues**: For non-security bugs only
- **GitHub Security**: For security vulnerabilities

## Acknowledgments

We would like to thank the following security researchers for responsibly disclosing vulnerabilities:

- (List will be updated as vulnerabilities are reported and fixed)

---

**Last Updated**: 2024
**Version**: 1.0.0
