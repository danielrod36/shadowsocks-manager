# 🚀 Dokploy Deployment Guide - Docker Compose

Deploy shadowsocks-manager with docker-compose on Dokploy in under 10 minutes!

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

- Dokploy installed and running
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

---

### Step 2: Create Application in Dokploy (3 minutes)

#### 2.1 Login to Dokploy

Open: `http://your-dokploy-server:3000`

#### 2.2 Create New Application

1. Click **"+ New Application"**
2. Fill in details:

| Field | Value |
|-------|-------|
| **Name** | `shadowsocks-manager` |
| **Type** | **Docker Compose** ⭐ |
| **Repository** | `https://github.com/shadowsocks/shadowsocks-manager.git` |
| **Branch** | `master` |
| **Compose File** | `docker-compose.yml` |

3. Click **"Create"**

---

### Step 3: Configure Ports (1 minute)

Dokploy will automatically detect ports from docker-compose.yml, but verify:

| Port | Purpose | Required |
|------|---------|----------|
| **8080** | Web GUI | ✅ Yes |
| **50000-60000** | Shadowsocks connections | ✅ Yes |

**Note**: With docker-compose, port configuration is in the `docker-compose.yml` file!

---

### Step 4: Deploy! (3 minutes)

1. Click **"Deploy"** button
2. Watch the build logs:

```
[INFO] Pulling images...
[INFO] Building ssmgr service...
[INFO] Starting services...
[INFO] shadowsocks-server: Started
[INFO] ssmgr-webgui: Started
[INFO] Health checks passing ✅
```

3. Wait for status: **"Healthy ✅"**

---

### Step 5: Access Your Web GUI (1 minute)

1. Open browser: `http://your-server-ip:8080`
2. Login with credentials:
   - **Default**: `admin@ssmgr.com` / `123456`
   - **Custom**: From your `setup.sh` output

3. You'll see the dashboard! 🎉

---

## 🔐 Security Setup (Do This First!)

### 1. Change Admin Password

1. Login to web GUI
2. Go to **Settings** → **Admin**
3. Change password
4. Save

### 2. Update Manager Password

Edit `config.yml`:
```yaml
manager:
  password: 'your-very-secure-password-here'
```

Then redeploy:
```bash
# In Dokploy, click "Redeploy"
```

---

## 🎨 Post-Deployment Configuration

### 1. Add Your Server

The shadowsocks server is already running! To connect it:

1. Go to **Servers** in web GUI
2. Click **Add Server**
3. Fill in:
   - **Name**: `Main Server`
   - **Address**: `shadowsocks:6002` ⭐ (Docker service name!)
   - **Password**: (manager password from config.yml)
4. Click **Save**
5. Status should show: **"Connected ✅"**

### 2. Create User Accounts

1. Go to **Users** → **Add User**
2. Fill in user details
3. Save

### 3. Create Shadowsocks Accounts

1. Go to **Accounts** → **Add Account**
2. Select user and server
3. Assign port (50000-60000)
4. Set traffic limits
5. Save

### 4. Generate Connection Info

1. Go to **Accounts**
2. Click **QR Code** for any account
3. Share with user!

---

## 🐳 Docker Compose Benefits

### Easy Management

```bash
# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart ssmgr

# Stop everything
docker-compose down

# Update and restart
docker-compose pull && docker-compose up -d
```

### Independent Scaling

```yaml
# In docker-compose.yml, you can scale:
services:
  ssmgr:
    deploy:
      replicas: 2  # Run 2 instances
```

### Easy Debugging

```bash
# Check shadowsocks logs only
docker-compose logs shadowsocks

# Check web GUI logs only
docker-compose logs ssmgr

# Enter container
docker-compose exec ssmgr bash
```

---

## 🌐 Domain Setup (Recommended)

### Option 1: Using Dokploy's Built-in Proxy

1. Go to your application in Dokploy
2. Click **Domains**
3. Add: `shadowsocks.yourdomain.com`
4. Dokploy handles SSL automatically! ✅

### Option 2: External Reverse Proxy

**Nginx:**
```nginx
server {
    listen 80;
    server_name shadowsocks.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Caddy:**
```
shadowsocks.yourdomain.com {
    reverse_proxy localhost:8080
}
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

## ✅ Deployment Checklist

- [ ] Customized `config.yml` with your domain
- [ ] Changed manager password
- [ ] Created application in Dokploy (Docker Compose type)
- [ ] Deployed successfully
- [ ] Both services healthy
- [ ] Accessed web GUI
- [ ] Changed admin password
- [ ] Added server (shadowsocks:6002)
- [ ] Created test user account
- [ ] Tested shadowsocks connection
- [ ] Configured domain (optional)
- [ ] Set up SSL (optional)

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
- ✅ Native Dokploy support

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
**Dokploy Support**: Native ⭐
