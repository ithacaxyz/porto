#!/usr/bin/env bash

set -euo pipefail

unix_epoch=$(date +%s)
base_url=${1:-http://localhost:6969}

#
# add `--url-query redirect=true` to either to get redirected to the payment page (receive back HTML)
#

# USA
curl --location --silent --request GET \
  --url "$base_url"/onramp/us \
  --url-query "address=0x1235309c817ab1b8e8a8ce96703f5c32f465869c" \
  --url-query "amount=80" \
  --url-query "email='$unix_epoch'_foo@barbar.com" \
  --url-query "phone=6569458945"

echo -e '\n'

# Global
curl --location --silent --request GET \
  --url "$base_url"/onramp/global \
  --url-query "address=0x1235309c817ab1b8e8a8ce96703f5c32f465869c" \
  --url-query "amount=80" \
  --url-query "email='$unix_epoch'_foo@barbar.com"