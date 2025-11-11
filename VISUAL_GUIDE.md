# 🎯 Visual Deployment Guide

## Step-by-Step with Screenshots Guide

---

## 📋 Before You Start

**What you need:**
- ✅ Dokploy installed
- ✅ This repository
- ✅ 10 minutes

---

## 🚀 Step 1: Customize Configuration (2 minutes)

### Run the setup script:

```bash
./setup.sh
```

### You'll be asked:

```
📝 Let's customize your configuration:

Enter your domain or IP address: shadowsocks.example.com
Enter a secure manager password: my-secure-password-123
Enter admin email/username: admin@example.com
Enter admin password: admin-password-456
```

### What happens:
- ✅ Updates `config.yml` with your settings
- ✅ Generates secure passwords
- ✅ Saves your credentials

**Output:**
```
✅ Configuration updated successfully!

📋 Your Settings:
================================
Domain/Site:       http://shadowsocks.example.com
Manager Password:  my-secure-password-123
Admin Username:    admin@example.com
Admin Password:    admin-password-456
================================

⚠️  IMPORTANT: Save these credentials securely!
```

---

## 🐳 Step 2: Create Application in Dokploy (3 minutes)

### 2.1 Login to Dokploy

Open your browser: `http://your-dokploy-server:3000`

### 2.2 Create New Application

Click: **"+ New Application"** or **"Create Application"**

### 2.3 Fill in Application Details

```
┌─────────────────────────────────────────┐
│ Create Application                       │
├─────────────────────────────────────────┤
│                                          │
│ Name: shadowsocks-manager                │
│                                          │
│ Type: ● Docker  ○ Git  ○ GitHub         │
│                                          │
│ Repository:                              │
│ https://github.com/shadowsocks/          │
│ shadowsocks-manager.git                  │
│                                          │
│ Branch: master                           │
│                                          │
│ Dockerfile Path: Dockerfile             │
│                                          │
│ Build Context: .                         │
│                                          │
└─────────────────────────────────────────┘
```

Click **"Create"**

---

## 🔌 Step 3: Configure Ports (2 minutes)

### 3.1 Go to Port Mappings

In your application, find: **"Ports"** or **"Port Mappings"**

### 3.2 Add Port Mappings

Click **"+ Add Port"** for each:

#### Port 1: Web GUI
```
┌─────────────────────────────────┐
│ Container Port: 8080             │
│ Host Port:      8080             │
│ Protocol:       TCP              │
└─────────────────────────────────┘
```

#### Port 2: Shadowsocks Range
```
┌─────────────────────────────────┐
│ Container Port: 50000-60000      │
│ Host Port:      50000-60000      │
│ Protocol:       TCP/UDP          │
└─────────────────────────────────┘
```

**Result:**
```
Ports:
✅ 8080:8080 (TCP)
✅ 50000-60000:50000-60000 (TCP/UDP)
```

---

## 💾 Step 4: Configure Volume (Optional but Recommended)

### 4.1 Go to Volumes

Find: **"Volumes"** or **"Mounts"**

### 4.2 Add Volume

Click **"+ Add Volume"**

```
┌─────────────────────────────────────────┐
│ Container Path: /root/.ssmgr            │
│ Host Path:      /var/lib/dokploy/       │
│                 shadowsocks-manager/data │
│ Type:           Bind                     │
└─────────────────────────────────────────┘
```

**Why?** This persists your database across restarts.

---

## 🚀 Step 5: Deploy! (3 minutes)

### 5.1 Click Deploy

Find the **"Deploy"** button and click it.

### 5.2 Watch the Build

You'll see logs like:
```
[INFO] Pulling repository...
[INFO] Building Docker image...
[INFO] Step 1/15 : FROM ubuntu:22.04
[INFO] Step 2/15 : ENV NODE_VERSION=20
...
[INFO] Successfully built abc123def456
[INFO] Starting container...
[INFO] Container started successfully
```

### 5.3 Wait for Health Check

Status will change:
```
Building... → Starting... → Healthy ✅
```

**Expected time:** 3-5 minutes

---

## 🌐 Step 6: Access Web GUI (1 minute)

### 6.1 Open Browser

Navigate to: `http://your-server-ip:8080`

### 6.2 Login Screen

You'll see:
```
┌─────────────────────────────────┐
│   Shadowsocks Manager            │
│                                  │
│   Email:    [              ]     │
│   Password: [              ]     │
│                                  │
│   [ Login ]                      │
└─────────────────────────────────┘
```

### 6.3 Login

Use credentials from Step 1:
- **Email**: `admin@example.com`
- **Password**: `admin-password-456`

### 6.4 Success!

You'll see the dashboard:
```
┌─────────────────────────────────────┐
│ Dashboard                            │
├─────────────────────────────────────┤
│ Servers: 0                           │
│ Users: 0                             │
│ Traffic: 0 GB                        │
└─────────────────────────────────────┘
```

---

## ⚙️ Step 7: Configure Server (2 minutes)

### 7.1 Add Server

Click: **"Servers"** → **"+ Add Server"**

```
┌─────────────────────────────────┐
│ Add Server                       │
├─────────────────────────────────┤
│ Name:     Main Server            │
│ Address:  127.0.0.1:6002         │
│ Password: my-secure-password-123 │
│                                  │
│ [ Save ]                         │
└─────────────────────────────────┘
```

**Note**: Use the manager password from Step 1!

### 7.2 Verify Connection

Status should show: **"Connected ✅"**

---

## 👥 Step 8: Create First User (2 minutes)

### 8.1 Add User

Click: **"Users"** → **"+ Add User"**

```
┌─────────────────────────────────┐
│ Add User                         │
├─────────────────────────────────┤
│ Email:    user@example.com       │
│ Password: user-password          │
│                                  │
│ [ Save ]                         │
└─────────────────────────────────┘
```

### 8.2 Create Account

Click: **"Accounts"** → **"+ Add Account"**

```
┌─────────────────────────────────┐
│ Add Account                      │
├─────────────────────────────────┤
│ User:     user@example.com       │
│ Server:   Main Server            │
│ Port:     50001                  │
│ Password: account-password       │
│ Method:   aes-256-gcm            │
│                                  │
│ Traffic Limit: 10 GB             │
│ Expiry: 30 days                  │
│                                  │
│ [ Save ]                         │
└─────────────────────────────────┘
```

### 8.3 Generate QR Code

Click: **"QR Code"** button

Share this with your user!

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Web GUI accessible at `http://your-server:8080`
- [ ] Can login with admin credentials
- [ ] Server shows "Connected"
- [ ] Can create users
- [ ] Can create accounts
- [ ] QR code generates successfully
- [ ] Shadowsocks client can connect

---

## 🔍 Troubleshooting

### Web GUI Not Loading

**Check:**
```bash
# View logs
dokploy logs shadowsocks-manager

# Look for:
[INFO] server start at 0.0.0.0:8080 ✅
```

**Fix:**
- Ensure port 8080 is exposed
- Check firewall rules
- Verify container is running

### Server Won't Connect

**Check:**
```bash
# View supervisor logs
dokploy exec shadowsocks-manager cat /var/log/supervisor/shadowsocks.out.log
```

**Fix:**
- Verify manager password matches config.yml
- Check shadowsocks process is running
- Restart container

### Can't Create Account

**Check:**
- Server is connected
- Port is in range 50000-60000
- Port is not already used

---

## 📊 Visual Architecture

```
┌─────────────────────────────────────────────┐
│           Your Dokploy Server                │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │   shadowsocks-manager Container     │    │
│  │                                      │    │
│  │  ┌──────────┐      ┌──────────┐   │    │
│  │  │    SS    │◄────►│  SSMGR   │   │    │
│  │  │  Server  │      │ Web GUI  │   │    │
│  │  └──────────┘      └──────────┘   │    │
│  │       │                  │          │    │
│  └───────┼──────────────────┼──────────┘    │
│          │                  │                │
└──────────┼──────────────────┼────────────────┘
           │                  │
           │                  │
    Port 50000-60000      Port 8080
           │                  │
           ▼                  ▼
    ┌──────────┐      ┌──────────┐
    │ SS Users │      │  Admin   │
    │ (Clients)│      │ Browser  │
    └──────────┘      └──────────┘
```

---

## 🎯 Quick Reference

### URLs
- **Web GUI**: `http://your-server:8080`
- **Dokploy**: `http://your-server:3000`

### Credentials
- **Admin**: From `setup.sh` output
- **Manager Password**: From `setup.sh` output

### Ports
- **8080**: Web GUI
- **50000-60000**: Shadowsocks connections

### Important Files
- **Config**: `/root/.ssmgr/default.yml`
- **Database**: `/root/.ssmgr/ssmgr.sqlite`
- **Logs**: `/var/log/supervisor/`

---

## 🎉 Success!

You now have a fully functional shadowsocks server with web management!

**What you can do:**
- ✅ Create unlimited users
- ✅ Monitor traffic usage
- ✅ Set bandwidth limits
- ✅ Generate QR codes
- ✅ Manage multiple servers
- ✅ View statistics

---

## 📚 Next Steps

1. **Secure your installation**
   - Change default passwords
   - Set up SSL/HTTPS
   - Configure firewall

2. **Customize**
   - Add email notifications
   - Enable Telegram bot
   - Configure payment system

3. **Scale**
   - Add more servers
   - Use MySQL instead of SQLite
   - Set up load balancing

---

## 📖 More Information

- **[QUICK_START.md](QUICK_START.md)** - Quick reference
- **[DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md)** - Detailed guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md)** - Implementation summary

---

**Total Time**: ~15 minutes  
**Difficulty**: Easy  
**Result**: Production-ready shadowsocks server

🚀 **Enjoy your new shadowsocks server!**
