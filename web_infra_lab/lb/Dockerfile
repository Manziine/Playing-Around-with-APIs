FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y haproxy openssh-server sudo && \
    mkdir /run/sshd && \
    id -u ubuntu &>/dev/null || useradd -m -s /bin/bash ubuntu && \
    echo "ubuntu:pass123" | chpasswd && \
    usermod -aG sudo ubuntu

COPY haproxy.cfg /etc/haproxy/haproxy.cfg

EXPOSE 80 22

CMD ["sh", "-c", "service ssh start && haproxy -f /etc/haproxy/haproxy.cfg"]
