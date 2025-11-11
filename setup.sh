#!/bin/bash

# Shadowsocks Manager - Quick Setup Script
# This script helps you customize the configuration before deployment

set -e

echo "🚀 Shadowsocks Manager - Quick Setup"
echo "===================================="
echo ""

# Check if config.yml exists
if [ ! -f "config.yml" ]; then
    echo "❌ Error: config.yml not found!"
    exit 1
fi

# Backup original config
cp config.yml config.yml.backup
echo "✅ Backed up config.yml to config.yml.backup"
echo ""

# Get user input
echo "📝 Let's customize your configuration:"
echo ""

# Domain/IP
read -p "Enter your domain or IP address (e.g., shadowsocks.example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    DOMAIN="http://localhost:8080"
else
    DOMAIN="http://$DOMAIN"
fi

# Manager password
read -p "Enter a secure manager password (for internal communication): " MANAGER_PASSWORD
if [ -z "$MANAGER_PASSWORD" ]; then
    MANAGER_PASSWORD="change-this-password-$(openssl rand -hex 8)"
    echo "⚠️  Generated random password: $MANAGER_PASSWORD"
fi

# Admin username
read -p "Enter admin email/username (default: admin@ssmgr.com): " ADMIN_USERNAME
if [ -z "$ADMIN_USERNAME" ]; then
    ADMIN_USERNAME="admin@ssmgr.com"
fi

# Admin password
read -p "Enter admin password (default: 123456): " ADMIN_PASSWORD
if [ -z "$ADMIN_PASSWORD" ]; then
    ADMIN_PASSWORD="123456"
fi

echo ""
echo "🔧 Updating configuration..."

# Update config.yml
sed -i.tmp "s|password: 'change-this-password-123'|password: '$MANAGER_PASSWORD'|g" config.yml
sed -i.tmp "s|site: 'http://your-domain.com'|site: '$DOMAIN'|g" config.yml

# Uncomment and set admin credentials
sed -i.tmp "s|# admin_username: 'admin@yourdomain.com'|admin_username: '$ADMIN_USERNAME'|g" config.yml
sed -i.tmp "s|# admin_password: 'your-secure-password'|admin_password: '$ADMIN_PASSWORD'|g" config.yml

# Remove temporary files
rm -f config.yml.tmp

echo ""
echo "✅ Configuration updated successfully!"
echo ""
echo "📋 Your Settings:"
echo "================================"
echo "Domain/Site:       $DOMAIN"
echo "Manager Password:  $MANAGER_PASSWORD"
echo "Admin Username:    $ADMIN_USERNAME"
echo "Admin Password:    $ADMIN_PASSWORD"
echo "================================"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo ""
echo "🎯 Next Steps:"
echo "1. Review config.yml to ensure everything is correct"
echo "2. Deploy to Dokploy following DOKPLOY_DEPLOYMENT_GUIDE.md"
echo "3. Access web GUI at: $DOMAIN:8080"
echo ""
echo "📚 For detailed instructions, see: DOKPLOY_DEPLOYMENT_GUIDE.md"
echo ""
