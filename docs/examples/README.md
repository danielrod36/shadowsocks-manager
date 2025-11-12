# Configuration Examples

This directory contains example configuration files for shadowsocks-manager.

## Available Examples

### 1. Basic Configuration
- **File**: `basic-config.yml`
- **Purpose**: Basic setup for single server deployment
- **Usage**: Copy to `~/.ssmgr/default.yml` and customize

### 2. Docker Compose
- **File**: `docker-compose.yml`
- **Purpose**: Full stack deployment with Docker Compose
- **Usage**: Deploy with `docker-compose up -d`

## Quick Start

### Option 1: Basic Setup
1. Copy `basic-config.yml` to `~/.ssmgr/default.yml`
2. Edit the file and change:
   - Manager password
   - Admin credentials
   - Your domain/IP
3. Start shadowsocks-manager

### Option 2: Docker Compose
1. Copy `docker-compose.yml` to your project directory
2. Create a `config.yml` file (use `basic-config.yml` as template)
3. Run `docker-compose up -d`

## Configuration Tips

### Security
- Always change default passwords
- Use strong, unique passwords
- Enable HTTPS in production
- Restrict manager API access

### Performance
- Use SQLite for small deployments
- Use MySQL for larger deployments
- Enable flow saver for traffic monitoring
- Set appropriate log levels

### Plugins
- Enable webgui for web management
- Configure telegram for bot notifications
- Set up email for user notifications
- Use freeAccount for trial accounts

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 8080 and 50000-60000 are available
2. **Database errors**: Check file permissions for SQLite database
3. **Plugin errors**: Verify plugin configurations are valid
4. **Connection issues**: Check firewall and network settings

### Getting Help
- Check application logs
- Review documentation in parent directory
- Search GitHub issues
- Verify configuration syntax

## Next Steps

After setting up your configuration:
1. Test the web GUI
2. Create test users and accounts
3. Verify shadowsocks connections
4. Monitor traffic and logs
5. Set up backups and monitoring

---

**Note**: These examples are starting points. Always customize for your specific environment and security requirements.
