# ✅ Deployment Checklist

Print this page and check off each step as you complete it!

---

## 📋 Pre-Deployment

- [ ] Dokploy is installed and accessible
- [ ] You have this repository cloned or forked
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

## 🐳 Dokploy Setup

### Create Application
- [ ] Login to Dokploy
- [ ] Click "Create Application"
- [ ] Select "Docker" type
- [ ] Enter application name: `shadowsocks-manager`
- [ ] Enter repository URL
- [ ] Set branch: `master`
- [ ] Set Dockerfile path: `Dockerfile`
- [ ] Click "Create"

### Configure Ports
- [ ] Go to "Ports" section
- [ ] Add port: `8080:8080` (TCP)
- [ ] Add port range: `50000-60000:50000-60000` (TCP/UDP)
- [ ] Save port configuration

### Configure Volume (Recommended)
- [ ] Go to "Volumes" section
- [ ] Add volume:
  - Container: `/root/.ssmgr`
  - Host: `/var/lib/dokploy/shadowsocks-manager/data`
- [ ] Save volume configuration

---

## 🚀 Deployment

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Check logs for errors
- [ ] Wait for status: "Healthy ✅"

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
  - Address: `127.0.0.1:6002`
  - Password: (manager password from setup)
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

- [ ] Check Dokploy dashboard shows container running
- [ ] Verify health check is passing
- [ ] Check CPU/memory usage is normal
- [ ] Review logs for any errors
- [ ] Set up alerts (optional)

---

## 📚 Documentation Review

- [ ] Bookmark web GUI URL
- [ ] Save admin credentials securely
- [ ] Save manager password securely
- [ ] Read [DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md) troubleshooting section
- [ ] Bookmark [VISUAL_GUIDE.md](VISUAL_GUIDE.md) for reference

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

## 📞 Support Resources

If you encounter issues:

1. **Check logs**:
   ```bash
   dokploy logs shadowsocks-manager
   ```

2. **Review documentation**:
   - [DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md)
   - [VISUAL_GUIDE.md](VISUAL_GUIDE.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)

3. **Common issues**:
   - Web GUI not loading → Check port 8080
   - Server won't connect → Check manager password
   - Can't create account → Check port range

4. **Get help**:
   - GitHub Issues
   - Documentation troubleshooting sections

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
