FROM ghcr.io/foundry-rs/foundry:latest

USER root

# Set non-interactive frontend to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Add unstable repository and install dependencies
RUN echo 'deb http://deb.debian.org/debian unstable main' >> /etc/apt/sources.list && \
    apt-get update -qq --allow-insecure-repositories && \
    apt-get install -yqq --allow-unauthenticated -t unstable libc6 libstdc++6 jq curl && \
    curl -L https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -o /usr/local/bin/yq && \
    chmod +x /usr/local/bin/yq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app 