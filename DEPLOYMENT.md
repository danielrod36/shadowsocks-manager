# 🚀 Deployment Guide

Deploy shadowsocks-manager with Docker Compose in under 10 minutes!

---

## 📋 What You'll Get

- ✅ Shadowsocks server (shadowsocks-rust) - Separate container
- ✅ Web management interface - Separate container
- ✅ User account management
- ✅ Traffic monitoring
- ✅ Persistent data storage
- ✅ Easy to scale and maintain

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack             │
│                                          │
│  ┌────────────────┐  ┌───────────────┐ │
│  │  Shadowsocks   │  │    SSMGR      │ │
│  │    Server      │◄─┤   Web GUI     │ │
│  │ (ss-rust)      │  │  (Node.js)    │ │
│  └────────────────┘  └───────────────┘ │
│         │                    │          │
│         │                    │          │
└─────────┼────────────────────┼──────────┘
          │                    │
    Port 50000-60000      Port 8080
          │                    │
          ▼                    ▼
      SS Users            Admin Browser
```

**Benefits:**
- ✅ Separate containers = easier debugging
- ✅ Can restart services independently
- ✅ Standard Docker approach
- ✅ Native Dokploy support

---

## 🎯 Prerequisites

- Docker and Docker Compose installed
- Domain name (optional but recommended)
- 5 minutes of your time

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Your Configuration (2 minutes)

**Option A: Use the setup script (Recommended)**

```bash
./setup.sh
```

This will customize your `config.yml` with:
- Your domain/IP
- Secure manager password
- Admin credentials

**Option B: Manual configuration**

Edit `config.yml` and change:

```yaml
manager:
  password: 'your-secure-password-here'  # ⚠️ CHANGE THIS!

plugins:
  webgui:
    site: 'http://your-domain.com'  # Your actual domain
    # admin_username: 'admin@yourdomain.com'
    # admin_password: 'your-secure-password'
```

### Step 2: Deploy with Docker Compose (3 minutes)

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 3: Access Your Web GUI (1 minute)

1. Open browser: `http://your-server-ip:8080`
2. Login with credentials:
   - **Default**: `admin@ssmgr.com` / `123456`
   - **Custom**: From your `setup.sh` output

3. You'll see the dashboard! 🎉

---

## ✅ Deployment Checklist

Print this page and check off each step as you complete it!

---

## 📋 Pre-Deployment

- [ ] Docker and Docker Compose installed
- [ ] You have this repository cloned
- [ ] You have your domain name or server IP ready
- [ ] Ports 8080 and 50000-60000 are available

---

## 🔧 Configuration

- [ ] Run `./setup.sh`
- [ ] Enter your domain/IP address
- [ ] Set manager password
- [ ] Set admin username
- [ ] Set admin password
- [ ] **Save credentials somewhere safe!**

---

## 🐳 Docker Setup

### Create Application
- [ ] Navigate to project directory
- [ ] Verify `docker-compose.yml` exists
- [ ] Verify `config.yml` is configured

### Configure Ports
- [ ] Port 8080 available for web GUI
- [ ] Port range 50000-60000 available for Shadowsocks
- [ ] Firewall configured to allow these ports

### Configure Volume (Recommended)
- [ ] Docker volume will be created automatically
- [ ] Data persists in `ssmgr_ssmgr-data` volume

---

## 🚀 Deployment

- [ ] Run `docker-compose up -d`
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Check logs for errors: `docker-compose logs -f`
- [ ] Wait for status: "Up (healthy)"

---

## 🌐 Access & Verify

- [ ] Open browser to `http://your-server:8080`
- [ ] See login page
- [ ] Login with admin credentials
- [ ] See dashboard

---

## ⚙️ Initial Configuration

### Add Server
- [ ] Go to "Servers" menu
- [ ] Click "+ Add Server"
- [ ] Enter:
  - Name: `Main Server`
  - Address: `shadowsocks:6002` ⭐ (Docker service name!)
  - Password: (manager password from config.yml)
- [ ] Click "Save"
- [ ] Verify status: "Connected ✅"

### Create Test User
- [ ] Go to "Users" menu
- [ ] Click "+ Add User"
- [ ] Enter email and password
- [ ] Click "Save"

### Create Test Account
- [ ] Go to "Accounts" menu
- [ ] Click "+ Add Account"
- [ ] Select user
- [ ] Select server
- [ ] Set port: `50001`
- [ ] Set password
- [ ] Set method: `aes-256-gcm`
- [ ] Set traffic limit
- [ ] Click "Save"

### Generate Connection
- [ ] Click "QR Code" for the account
- [ ] QR code displays successfully
- [ ] Save or share QR code

---

## 🔐 Security Hardening

- [ ] Change admin password (if using default)
- [ ] Review firewall rules
- [ ] Consider setting up SSL/HTTPS
- [ ] Review user permissions
- [ ] Set up regular backups

---

## 🧪 Testing

### Test Web GUI
- [ ] Can login
- [ ] Can create users
- [ ] Can create accounts
- [ ] Can view statistics
- [ ] Can generate QR codes

### Test Shadowsocks Connection
- [ ] Install shadowsocks client
- [ ] Scan QR code or enter details manually
- [ ] Connect to server
- [ ] Test internet connection through proxy
- [ ] Check traffic appears in dashboard

---

## 📊 Monitoring Setup

- [ ] Check Docker dashboard shows containers running
- [ ] Verify health check is passing
- [ ] Check CPU/memory usage is normal
- [ ] Review logs for any errors
- [ ] Set up alerts (optional)

---

## 📚 Documentation Review

- [ ] Bookmark web GUI URL
- [ ] Save admin credentials securely
- [ ] Save manager password securely
- [ ] Bookmark troubleshooting section
- [ ] Bookmark visual guide for reference

---

## 🎯 Optional Enhancements

### Email Notifications
- [ ] Get SMTP credentials
- [ ] Edit `config.yml` email section
- [ ] Redeploy application
- [ ] Test email sending

### Telegram Bot
- [ ] Create bot with @BotFather
- [ ] Get bot token
- [ ] Edit `config.yml` telegram section
- [ ] Redeploy application
- [ ] Test bot commands

### Domain & SSL
- [ ] Point domain to server
- [ ] Configure reverse proxy (nginx/Caddy)
- [ ] Install SSL certificate
- [ ] Update `config.yml` site URL
- [ ] Redeploy application

### Backup Strategy
- [ ] Set up automated backups
- [ ] Test backup restoration
- [ ] Document backup location
- [ ] Set backup schedule

---

## ✅ Final Verification

- [ ] Web GUI accessible from internet
- [ ] Admin can login
- [ ] Users can be created
- [ ] Accounts can be created
- [ ] Shadowsocks connections work
- [ ] Traffic is being tracked
- [ ] Logs are clean (no errors)
- [ ] Health check passing
- [ ] All credentials saved securely
- [ ] Documentation bookmarked

---

## 🎉 Deployment Complete!

**Date Completed**: _______________

**Deployed By**: _______________

**Server URL**: _______________

**Admin Email**: _______________

**Notes**:
```
_________________________________________________

_________________________________________________

_________________________________________________

_________________________________________________
```

---

## 🔧 Troubleshooting

### Web GUI Not Loading

**Check service status:**
```bash
docker-compose ps
```

**Expected output:**
```
NAME                 STATUS              PORTS
shadowsocks-server   Up (healthy)        
ssmgr-webgui        Up (healthy)        0.0.0.0:8080->8080/tcp
```

**Check logs:**
```bash
docker-compose logs ssmgr
```

**Look for:**
```
[INFO] server start at 0.0.0.0:8080 ✅
```

**Common fixes:**
- Ensure port 8080 is not in use
- Check firewall rules
- Verify config.yml is valid

### Shadowsocks Server Won't Connect

**Check shadowsocks logs:**
```bash
docker-compose logs shadowsocks
```

**Verify network:**
```bash
docker-compose exec ssmgr ping shadowsocks
```

**Common fixes:**
- Verify manager password matches
- Check shadowsocks service is healthy
- Restart services: `docker-compose restart`

### Can't Create Accounts

**Check:**
1. Server is connected in web GUI
2. Port is in range 50000-60000
3. Port is not already used

**Test port:**
```bash
docker-compose exec shadowsocks nc -zv localhost 50001
```

---

## 📊 Monitoring

### Check Service Health

```bash
# All services
docker-compose ps

# Specific service
docker-compose ps ssmgr
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f ssmgr
```

### Resource Usage

```bash
# Docker stats
docker stats shadowsocks-server ssmgr-webgui
```

---

## 🔄 Updating

### Update to Latest Version

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Backup Before Update

```bash
# Backup volume
docker run --rm -v ssmgr_ssmgr-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/ssmgr-backup-$(date +%Y%m%d).tar.gz /data
```

### Restore Backup

```bash
# Restore volume
docker run --rm -v ssmgr_ssmgr-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/ssmgr-backup-20240101.tar.gz -C /
```

---

## 📱 Optional Features

### Enable Email Notifications

Edit `config.yml`:

```yaml
plugins:
  email:
    use: true
    type: 'smtp'
    username: 'your-email@gmail.com'
    password: 'your-app-password'
    host: 'smtp.gmail.com'
    port: 587
```

Redeploy:
```bash
docker-compose up -d
```

### Enable Telegram Bot

1. Create bot with [@BotFather](https://t.me/botfather)
2. Get bot token
3. Edit `config.yml`:

```yaml
plugins:
  webgui_telegram:
    use: true
    token: 'your-bot-token'
```

4. Redeploy:
```bash
docker-compose up -d
```

---

## 🎯 Quick Reference

### Default Credentials
- **Web GUI**: `admin@ssmgr.com` / `123456`

### Important Ports
- **8080**: Web GUI
- **50000-60000**: Shadowsocks connections

### Docker Services
- **shadowsocks**: Shadowsocks server
- **ssmgr**: Web GUI

### Important Paths
- **Config**: `./config.yml` (mounted)
- **Database**: Docker volume `ssmgr-data`
- **Compose**: `./docker-compose.yml`

### Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart ssmgr

# Rebuild and restart
docker-compose up -d --build

# Check status
docker-compose ps

# Enter container
docker-compose exec ssmgr bash

# View volume location
docker volume inspect ssmgr_ssmgr-data
```

---

## 🆘 Need Help?

### Common Issues

**"Cannot connect to web GUI"**
```bash
# Check if service is running
docker-compose ps ssmgr

# Check logs
docker-compose logs ssmgr

# Restart
docker-compose restart ssmgr
```

**"Shadowsocks not working"**
```bash
# Check shadowsocks service
docker-compose ps shadowsocks

# Check logs
docker-compose logs shadowsocks

# Verify network
docker-compose exec ssmgr ping shadowsocks
```

**"Database locked"**
```bash
# Restart services
docker-compose restart

# If persists, check volume
docker volume inspect ssmgr_ssmgr-data
```

### Get Support

- **GitHub Issues**: https://github.com/shadowsocks/shadowsocks-manager/issues
- **Documentation**: See other .md files in this repo
- **Logs**: Always check logs first!

---

## 🎉 Success!

You now have a fully functional shadowsocks server with web management interface running on Docker Compose!

**Advantages of this setup:**
- ✅ Easy to manage (docker-compose commands)
- ✅ Easy to debug (separate containers)
- ✅ Easy to scale (add more services)
- ✅ Easy to update (rebuild specific services)

**Next steps:**
1. Create user accounts
2. Share connection details
3. Monitor traffic usage
4. Enjoy! 🚀

---

**Deployment Time**: ~10 minutes  
**Difficulty**: Easy  
**Maintenance**: Very Low  
**Scalability**: Excellent

---

## 🔄 Maintenance Schedule

Set reminders for:

- [ ] **Weekly**: Check logs for errors
- [ ] **Weekly**: Review traffic usage
- [ ] **Monthly**: Update user accounts
- [ ] **Monthly**: Review security settings
- [ ] **Quarterly**: Backup database
- [ ] **Quarterly**: Update software
- [ ] **Yearly**: Review and renew SSL certificates

---

**Checklist Version**: 1.0  
**Last Updated**: 2024  
**Estimated Time**: 15-20 minutes

✅ **You're all set! Enjoy your shadowsocks server!**
