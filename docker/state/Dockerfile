FROM ubuntu:latest

USER root

COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq
COPY --from=mikefarah/yq:latest /usr/bin/yq /usr/local/bin/yq
COPY --from=ghcr.io/foundry-rs/foundry:latest /usr/local/bin/anvil /usr/local/bin/anvil
COPY --from=ghcr.io/foundry-rs/foundry:latest /usr/local/bin/forge /usr/local/bin/forge
COPY --from=ghcr.io/foundry-rs/foundry:latest /usr/local/bin/cast /usr/local/bin/cast

COPY contracts/account /app/account
COPY contracts/demo /app/demo
COPY docker/state /app/

WORKDIR /app
