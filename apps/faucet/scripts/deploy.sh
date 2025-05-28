#!/usr/bin/env bash

set -eou pipefail

PRIVATE_KEY=$1

if [ -z "$PRIVATE_KEY" ]; then
  echo "Usage: /bin/bash $0 <private_key>"
  exit 1
fi

# deploy worker
pnpm dlx wrangler@latest --config='wrangler.json' deploy --keep-vars

# push private key to secret store
echo "$PRIVATE_KEY" | pnpm dlx wrangler@latest --config='wrangler.json' secret put DRIP_PRIVATE_KEY
