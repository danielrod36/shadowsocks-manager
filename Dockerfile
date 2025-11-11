FROM ubuntu:22.04
LABEL maintainer="Shadowsocks Manager"
LABEL description="Full stack shadowsocks-manager with shadowsocks-rust and web GUI"

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tzdata \
        iproute2 \
        curl \
        wget \
        git \
        sudo \
        software-properties-common \
        python3 \
        python3-pip \
        ca-certificates \
        gnupg \
        xz-utils \
        supervisor && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    cd /tmp && \
    wget https://github.com/shadowsocks/shadowsocks-rust/releases/download/v1.20.4/shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar.xz && \
    xz -d shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar.xz && \
    tar -xvf shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar && \
    mv /tmp/ssmanager /usr/bin/ && \
    rm -rf /tmp/* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy application files
WORKDIR /app
COPY package*.json ./
RUN npm install --production && npm cache clean --force

COPY . .

# Create necessary directories
RUN mkdir -p /root/.ssmgr /var/log/supervisor

# Copy default configuration
COPY config.yml /root/.ssmgr/default.yml

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 8080 6001 6002 50000-60000/tcp 50000-60000/udp

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/home/login || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
