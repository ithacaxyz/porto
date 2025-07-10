#!/usr/bin/env bash

set -euo pipefail

curl --location --silent --request POST \
  --url https://api.developer.coinbase.com/onramp/v2/onramp/order \
  --header "Authorization: Bearer $1" \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "paymentAmount": "10",
    "paymentCurrency": "USD",
    "purchaseCurrency": "USDC",
    "paymentMethod": "GUEST_CHECKOUT_CARD",
    "destinationAddress": "0x1d4e95d95dff0b7f005bca0d69e999aae2ea6528",
    "destinationNetwork": "base",
    "email": "jondie@gmail.com",
    "phoneNumber": "(+1)6724459785",
    "agreementAcceptedAt": "2025-07-07T00:00:00Z",
    "partnerUserRef": "sandbox-satoshi1234"
  }'