FROM ubuntu:22.04
LABEL maintainer="Gyteng <igyteng@gmail.com>"

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20

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
        xz-utils && \
    pip3 install git+https://github.com/gyteng/shadowsocks.git@master && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs shadowsocks-libev && \
    npm i -g shadowsocks-manager --unsafe-perm && \
    cd /tmp && \
    wget https://github.com/shadowsocks/shadowsocks-rust/releases/download/v1.20.4/shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar.xz && \
    xz -d shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar.xz && \
    tar -xvf shadowsocks-v1.20.4.x86_64-unknown-linux-gnu.tar && \
    mv /tmp/ssmanager /usr/bin/ && \
    rm -rf /tmp/* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "Asia/Shanghai" > /etc/timezone && \
    rm -f /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/home/login || exit 1

CMD ["/usr/bin/ssmgr"]
