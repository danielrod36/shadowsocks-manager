# 🏗️ Architecture Overview

## Full Stack Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Supervisor Process Manager             │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│         ┌────────────────┴────────────────┐                │
│         │                                  │                │
│         ▼                                  ▼                │
│  ┌─────────────┐                  ┌──────────────┐         │
│  │ Shadowsocks │                  │   SSMGR      │         │
│  │   Server    │◄────────────────►│  Web GUI     │         │
│  │ (ss-rust)   │  127.0.0.1:6001  │  (Node.js)   │         │
│  └─────────────┘                  └──────────────┘         │
│         │                                  │                │
│         │                                  │                │
│         │ Port 50000-60000                │ Port 8080      │
│         │ (Shadowsocks)                   │ (Web GUI)      │
└─────────┼──────────────────────────────────┼────────────────┘
          │                                  │
          │                                  │
          ▼                                  ▼
    ┌──────────┐                      ┌──────────┐
    │ SS Users │                      │  Admin   │
    │ (Clients)│                      │ Browser  │
    └──────────┘                      └──────────┘
```

## Component Details

### 1. Shadowsocks Server (shadowsocks-rust)
- **Purpose**: Handles proxy connections
- **Port**: 50000-60000 (configurable per user)
- **Protocol**: TCP/UDP
- **Management**: Via manager API on 127.0.0.1:6001

### 2. SSMGR Web GUI
- **Purpose**: Web-based management interface
- **Port**: 8080 (exposed to internet)
- **Features**:
  - User management
  - Traffic monitoring
  - Account creation
  - QR code generation
  - Statistics dashboard

### 3. Internal Communication
- **Manager API**: 127.0.0.1:6001 (shadowsocks ← ssmgr)
- **Manager Port**: 0.0.0.0:6002 (for multi-server setups)
- **Database**: SQLite at `/root/.ssmgr/ssmgr.sqlite`

## Data Flow

### User Connection Flow
```
1. User opens shadowsocks client
2. Client connects to server:50001 (example)
3. Shadowsocks server proxies traffic
4. Traffic is logged and counted
5. SSMGR updates database with usage stats
```

### Admin Management Flow
```
1. Admin opens browser → http://server:8080
2. Login to web GUI
3. Create/manage users
4. SSMGR sends commands to shadowsocks via API
5. Shadowsocks opens/closes ports as needed
```

## Port Mapping

| Port Range | Purpose | Exposed |
|------------|---------|---------|
| 8080 | Web GUI | ✅ Yes |
| 6001 | SS Manager API | ❌ Internal only |
| 6002 | SSMGR Manager API | ❌ Internal only |
| 50000-60000 | Shadowsocks connections | ✅ Yes |

## File Structure

```
/root/.ssmgr/
├── default.yml          # Configuration file
├── ssmgr.sqlite         # Database (users, accounts, traffic)
└── logs/                # Application logs

/var/log/supervisor/
├── shadowsocks.out.log  # SS server output
├── shadowsocks.err.log  # SS server errors
├── ssmgr.out.log        # SSMGR output
└── ssmgr.err.log        # SSMGR errors
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Internet (Public)                │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
    Port 8080         Port 50000-60000
    (Web GUI)         (SS Connections)
         │                 │
         │                 │
┌────────┴─────────────────┴──────────────┐
│         Firewall / Dokploy               │
└────────┬─────────────────┬──────────────┘
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌──────────┐
    │ Helmet  │      │ SS Rust  │
    │ Rate    │      │ Encrypt  │
    │ Limit   │      │          │
    └─────────┘      └──────────┘
         │                 │
         ▼                 ▼
    ┌─────────────────────────┐
    │   Application Layer      │
    └─────────────────────────┘
```

## Scaling Options

### Single Server (Current Setup)
```
[Container] → Shadowsocks + Web GUI
```
**Pros**: Simple, all-in-one  
**Cons**: Limited to one server

### Multi-Server Setup
```
[Web GUI Container] ← → [SS Server 1]
                    ← → [SS Server 2]
                    ← → [SS Server 3]
```
**Pros**: Scalable, distributed  
**Cons**: More complex setup

## Resource Requirements

### Minimum
- **CPU**: 1 core
- **RAM**: 512 MB
- **Disk**: 1 GB
- **Bandwidth**: 10 Mbps

### Recommended
- **CPU**: 2 cores
- **RAM**: 1 GB
- **Disk**: 5 GB
- **Bandwidth**: 100 Mbps

### For 100+ Users
- **CPU**: 4 cores
- **RAM**: 2 GB
- **Disk**: 10 GB
- **Bandwidth**: 1 Gbps

## Monitoring Points

1. **Web GUI Health**: `http://localhost:8080/api/home/login`
2. **Shadowsocks Process**: Check supervisor logs
3. **Database Size**: Monitor `/root/.ssmgr/ssmgr.sqlite`
4. **Traffic Usage**: View in web GUI dashboard
5. **Container Resources**: Dokploy dashboard

## Backup Strategy

### What to Backup
```
/root/.ssmgr/
├── ssmgr.sqlite    ← Users, accounts, traffic data
└── default.yml     ← Configuration
```

### Backup Command
```bash
docker cp shadowsocks-manager:/root/.ssmgr /backup/$(date +%Y%m%d)
```

### Restore Command
```bash
docker cp /backup/20240101/.ssmgr shadowsocks-manager:/root/
docker restart shadowsocks-manager
```

## High Availability Setup

For production environments:

```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴────┐
   │        │
   ▼        ▼
[Server 1] [Server 2]
   │        │
   └───┬────┘
       │
   ┌───▼────┐
   │ Shared │
   │   DB   │
   └────────┘
```

**Note**: Current setup uses SQLite (single server). For HA, switch to MySQL/PostgreSQL.

## Troubleshooting Flow

```
Issue Reported
     │
     ▼
Check Dokploy Logs
     │
     ├─► Container not running? → Check deployment
     │
     ├─► Port not accessible? → Check firewall
     │
     ├─► Web GUI error? → Check ssmgr logs
     │
     └─► SS connection fails? → Check shadowsocks logs
```

## Performance Tuning

### For High Traffic
1. Increase port range (50000-65535)
2. Use faster encryption (aes-128-gcm)
3. Enable TCP Fast Open
4. Increase file descriptors

### For Many Users
1. Use MySQL instead of SQLite
2. Enable Redis caching
3. Increase container resources
4. Use CDN for web GUI

---

**For deployment instructions, see:**
- [QUICK_START.md](QUICK_START.md)
- [DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md)
