#!/usr/bin/env bash
# Update relay.yaml using capabilities fetched from JSON-RPC `wallet_getCapabilities`.
#
# Requirements:
#   • curl
#   • jq (https://stedolan.github.io/jq/)
#   • yq v4 (https://github.com/mikefarah/yq)
#
# These are installed in the `config` service image via `apk add --no-cache curl jq yq`.
#
# Usage:
#   RPC_URL=http://anvil:8545 ./config.sh
#
set -euo pipefail

CHAIN_ID="${CHAIN_ID:-84532}"
CHAIN_ID_HEX=$(printf '0x%x' "$CHAIN_ID")
RPC_URL="${RPC_URL:-https://base-sepolia.rpc.ithaca.xyz}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/relay.yaml"

echo "Fetching capabilities from $RPC_URL …" >&2

payload=$(jq -nc --argjson chain $CHAIN_ID '{jsonrpc:"2.0", id:1, method:"wallet_getCapabilities", params:[[ $chain ]] }')

capabilities_json=$(curl -sS -X POST \
  -H 'Content-Type: application/json' \
  --data "$payload" \
  "$RPC_URL" | jq -e ".result.[\"$CHAIN_ID_HEX\"]")

echo "Parsing and updating $CONFIG_FILE …" >&2

# 1. Reset fee_tokens array
# 2. Append each token address
fee_tokens=$(echo "$capabilities_json" | jq -r '.fees.tokens[].address')

# # Clear the array first
yq e -i '.chain.fee_tokens = []' "$CONFIG_FILE"
for token in $fee_tokens; do
  yq e -i ".chain.fee_tokens += [\"$token\"]" "$CONFIG_FILE"
  echo "  • Added fee token $token" >&2
done

# Update contract addresses
account_registry=$(echo "$capabilities_json" | jq -r '.contracts.accountRegistry.address')
delegation_proxy=$(echo "$capabilities_json" | jq -r '.contracts.accountProxy.address')
orchestrator=$(echo "$capabilities_json" | jq -r '.contracts.orchestrator.address')
simulator=$(echo "$capabilities_json" | jq -r '.contracts.simulator.address')

echo "$capabilities_json"

yq e -i ".account_registry = \"$account_registry\"" "$CONFIG_FILE"
yq e -i ".delegation_proxy = \"$delegation_proxy\"" "$CONFIG_FILE"
yq e -i ".orchestrator = \"$orchestrator\"" "$CONFIG_FILE"
yq e -i ".simulator = \"$simulator\"" "$CONFIG_FILE"

echo "relay.yaml updated successfully." 