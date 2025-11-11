# 🚀 Quick Start - Dokploy Deployment (Docker Compose)

Deploy shadowsocks-manager with docker-compose in 3 easy steps!

---

## ⚡ Super Quick Start (3 Steps)

### 1️⃣ Customize Configuration

Run the setup script:

```bash
./setup.sh
```

This will ask you a few questions and configure everything automatically.

### 2️⃣ Deploy to Dokploy

1. Login to Dokploy
2. Create new application
3. Select **"Docker Compose"** type ⭐
4. Point to this repository
5. Click Deploy!

### 3️⃣ Access Web GUI

Open: `http://your-server-ip:8080`

Login with the credentials from step 1.

**Done!** 🎉

---

## 🐳 Why Docker Compose?

- ✅ **Native Dokploy support** - Works perfectly with Dokploy
- ✅ **Separate containers** - Easier to debug and manage
- ✅ **Standard approach** - Industry best practice
- ✅ **Easy to scale** - Add more services easily
- ✅ **Simple commands** - `docker-compose up/down/restart`

---

## 📚 Detailed Guide

For complete step-by-step instructions, see:

👉 **[DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md)**

---

## 🔧 Manual Configuration

If you prefer to configure manually:

1. Edit `config.yml`
2. Change these values:
   - `manager.password` - Secure password for internal communication
   - `plugins.webgui.site` - Your domain or IP
   - `plugins.webgui.admin_username` - Admin login email
   - `plugins.webgui.admin_password` - Admin login password

---

## 📦 What's Included

### Two Separate Containers:

**1. Shadowsocks Server**
- ✅ shadowsocks-rust (latest)
- ✅ Manager API
- ✅ Auto-restart
- ✅ Health checks

**2. Web GUI**
- ✅ Node.js application
- ✅ User management
- ✅ Traffic monitoring
- ✅ SQLite database
- ✅ Persistent storage

---

## 🔐 Default Credentials

**If you don't customize:**
- Username: `admin@ssmgr.com`
- Password: `123456`

⚠️ **Change these immediately after first login!**

---

## 🌐 Ports

| Port | Purpose |
|------|---------|
| 8080 | Web GUI |
| 50000-60000 | Shadowsocks connections |

**Note**: Ports are configured in `docker-compose.yml`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      Docker Compose Stack            │
│                                      │
│  ┌────────────┐    ┌─────────────┐ │
│  │Shadowsocks │◄──►│   SSMGR     │ │
│  │  Server    │    │  Web GUI    │ │
│  └────────────┘    └─────────────┘ │
│        │                  │         │
└────────┼──────────────────┼─────────┘
         │                  │
    Port 50000          Port 8080
         │                  │
         ▼                  ▼
     SS Users          Admin Browser
```

---

## 📖 More Documentation

- [DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Step-by-step with diagrams
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Printable checklist
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [README.md](README.md) - Full project documentation

---

## 🆘 Need Help?

### Quick Troubleshooting

**Web GUI not loading?**
```bash
docker-compose logs ssmgr
```

**Shadowsocks not working?**
```bash
docker-compose logs shadowsocks
```

**Restart everything:**
```bash
docker-compose restart
```

### Get More Help

1. Check [DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md) troubleshooting section
2. View logs in Dokploy dashboard
3. Open an issue on GitHub

---

## ✅ Quick Checklist

- [ ] Run `./setup.sh` to configure
- [ ] Create application in Dokploy
- [ ] Select **"Docker Compose"** type
- [ ] Deploy
- [ ] Access web GUI at port 8080
- [ ] Change admin password
- [ ] Add server (use `shadowsocks:6002`)
- [ ] Create first user
- [ ] Test connection

---

## 🎯 Dokploy Configuration

When creating the application in Dokploy:

| Setting | Value |
|---------|-------|
| **Name** | `shadowsocks-manager` |
| **Type** | **Docker Compose** ⭐ |
| **Repository** | Your repo URL |
| **Branch** | `master` |
| **Compose File** | `docker-compose.yml` |

**That's it!** Dokploy will handle the rest.

---

## 🚀 Useful Commands

After deployment, you can use these commands:

```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart ssmgr

# Stop everything
docker-compose down

# Start everything
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build
```

---

## 🎉 What's Next?

After deployment:

1. **Login** to web GUI
2. **Change** admin password
3. **Add server** (use `shadowsocks:6002` as address)
4. **Create users** and accounts
5. **Share** QR codes with users
6. **Monitor** traffic in dashboard

---

**Deployment Time**: ~10 minutes  
**Difficulty**: Easy  
**Support**: Full documentation included  
**Dokploy**: Native support ⭐
