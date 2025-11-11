[![NPM version][npm-image]][npm-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/shadowsocks-manager.svg?style=flat-square
[npm-url]: https://npmjs.org/package/shadowsocks-manager
[download-url]: https://npmjs.org/package/shadowsocks-manager
[license-image]: https://img.shields.io/npm/l/shadowsocks-manager.svg

# shadowsocks-manager

A shadowsocks manager tool for multi user and traffic control.
Base on Node.js and SQLite.

For more details, you can see [docs](https://shadowsocks.github.io/shadowsocks-manager/).

If you want to use the old version, please switch to [this branch](https://github.com/shadowsocks/shadowsocks-manager/tree/version1).

## 🚀 Quick Deploy with Dokploy

**New!** Deploy the full stack (shadowsocks + web GUI) in 10 minutes:

👉 **[QUICK_START.md](QUICK_START.md)** - 3-step deployment guide
👉 **[DOKPLOY_DEPLOYMENT_GUIDE.md](DOKPLOY_DEPLOYMENT_GUIDE.md)** - Complete deployment guide

```bash
# Quick setup
./setup.sh

# Then deploy to Dokploy!
```

## ⚠️ Security Notice

**Important**: This project has been updated with critical security fixes. Please read [SECURITY_UPGRADE_GUIDE.md](SECURITY_UPGRADE_GUIDE.md) before upgrading.

### Recent Security Updates
- Fixed critical vulnerabilities in axios, ejs, js-yaml, and ws
- Updated Node.js requirement to 18.0.0+ (Node.js 12 is EOL)
- Added security middleware (Helmet.js, rate limiting)
- Removed deprecated packages (request, request-promise)

See [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) for complete details.

## Dependencies

* **Node.js 18.0.0 or higher** (20.x LTS recommended)
* Redis (optional, for session storage)

**Note**: Node.js 12 is no longer supported due to end-of-life. Please upgrade to Node.js 18 or 20.

## Install

### Prerequisites

Ensure you have Node.js 18+ installed:
```bash
node --version  # Should show v18.x.x or v20.x.x
```

If you need to upgrade Node.js, we recommend using [nvm](https://github.com/nvm-sh/nvm):
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20
```

### From source:

```bash
git clone https://github.com/shadowsocks/shadowsocks-manager.git
cd shadowsocks-manager
npm install
npm run build
```
use `node server.js` to run this program.

### From npm:
```bash
npm i -g shadowsocks-manager
```
You may need to use the `--unsafe-perm` flag if you receive a permission error:
```bash
npm i -g shadowsocks-manager --unsafe-perm
```
use `ssmgr` to run this program.

### From docker:
```bash
docker run --name ssmgr -idt -v ~/.ssmgr:/root/.ssmgr --net=host gyteng/ssmgr [ssmgr params...]
```

**Note**: Docker images have been updated to use Node.js 20 and Ubuntu 22.04 LTS.

### Build docker image:

here is the `Dockerfile`

```
FROM ubuntu:18.04
MAINTAINER gyteng <igyteng@gmail.com>
RUN apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get install tzdata iproute2 curl git sudo software-properties-common python-pip -y && \
    pip install git+https://github.com/shadowsocks/shadowsocks.git@master && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs shadowsocks-libev && \
    npm i -g shadowsocks-manager --unsafe-perm && \
    echo "Asia/Shanghai" > /etc/timezone && \
    rm /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
CMD ["/usr/bin/ssmgr"]
```

### Usage
1. Start shadowsocks with [manager API](https://github.com/shadowsocks/shadowsocks/wiki/Manage-Multiple-Users), it supports `shadowsocks-python` and `shadowsocks-libev`.
For example, you can run this command:  
```
ss-manager -m aes-256-cfb -u --manager-address 127.0.0.1:6001
 or
ssserver -m aes-256-cfb -p 12345 -k abcedf --manager-address 127.0.0.1:6001
```
2. run ssmgr with type s:

  config file:  
  ```
  type: s

  shadowsocks:
    address: 127.0.0.1:6001
  manager:
    address: 0.0.0.0:4001
    password: '123456'
  db: 'ss.sqlite'
  ```

  If you want to use MySQL, the `db` must like this:

  ```
  db:
    host: '1.1.1.1'
    user: 'root'
    password: 'abcdefg'
    database: 'ssmgr'
  ```

  And you have to close `only_full_group_by` when the version of MySQL is greater than 5.7

  command:  
  `ssmgr -c /your/config/file/path.yml`

3. If you have several servers, you have to run step 1 and step 2 in every server.  
The listening address in `--manager-address` of step 1 and in `shadowsocks -> address` of step 2's config file must be same. For security reseon, we recommend you to use `127.0.0.1` instead of `0.0.0.0`.
4. Now you can use the plugins to manage them. You can read the details in plugins readme page.

```
+-------------+    +-------------+       +------+
| Shadowsocks |    | Shadowsocks |  ...  |      |
| manager API |    | manager API |       |      |
+-------------+    +-------------+       +------+
       |                 |                  |
       |                 |                  |
+-------------+    +-------------+       +------+
| ssmgr       |    | ssmgr       |  ...  |      |
| with type s |    | with type s |       |      |
+-------------+    +-------------+       +------+
       |                 |                  |
       +------------+----+--------  ...  ---+
                    |
                    |
             +---------------+
             | ssmgr plugins |
             |  with type m  |
             +---------------+
```

### Plugins

[telegram](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/telegram/README.md)  
[freeAccount](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/freeAccount/README.md)  
[webgui](https://github.com/shadowsocks/shadowsocks-manager/blob/master/plugins/webgui/README.md)  

### Parameter

`ssmgr --help` will show startup parameters info.

```
Usage: ssmgr [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -c, --config [file]          config file, default: ~/.ssmgr/default.yml
    -d, --db [file]              sqlite3 file, sample: ~/.ssmgr/db.sqlite
    -t, --type [type]            type, s for server side, m for manager side
    -s, --shadowsocks [address]  ss-manager address, sample: 127.0.0.1:6001
    -m, --manager [address]      manager address, sample: 0.0.0.0:6002
    -p, --password [password]    manager password, both server side and manager side must be equals
    -r, --run [type]             run shadowsocks from child_process, sample: libev / libev:aes-256-cfb / python / python:aes-256-cfb
    --debug                      show debug message
```

First, ssmgr will read the config file in `--config`, and other parameters(`-detsmp`) will replace the config file values.

### Translate

If your want to help to translate it to other languages, please edit files [here](https://github.com/shadowsocks/shadowsocks-manager/tree/dev/plugins/webgui/public/translate) and give me a pull request.
