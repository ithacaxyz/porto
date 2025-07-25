ANVIL_ADDRESS=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
ANVIL_PRIVATE_KEY=0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
RPC_URL=http://anvil:8545

echo "Deploying Orchestrator..."
ORCHESTRATOR_ADDRESS=$(forge create Orchestrator --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args 0x0000000000000000000000000000000000000000 | jq -r '.deployedTo')
echo "Orchestrator deployed to: $ORCHESTRATOR_ADDRESS"

echo "Deploying IthacaAccount..."
ACCOUNT_ADDRESS=$(forge create IthacaAccount --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args $ORCHESTRATOR_ADDRESS | jq -r '.deployedTo')
echo "IthacaAccount deployed to: $ACCOUNT_ADDRESS"

echo "Deploying EIP7702Proxy..."
ACCOUNT_PROXY_ADDRESS=$(forge create EIP7702Proxy --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args $ACCOUNT_ADDRESS $ANVIL_ADDRESS | jq -r '.deployedTo')
echo "EIP7702Proxy deployed to: $ACCOUNT_PROXY_ADDRESS"

echo "Deploying Simulator..."
SIMULATOR_ADDRESS=$(forge create Simulator --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY | jq -r '.deployedTo')
echo "Simulator deployed to: $SIMULATOR_ADDRESS"

echo "Deploying Funder..."
FUNDER_ADDRESS=$(forge create SimpleFunder --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args $ANVIL_ADDRESS $ORCHESTRATOR_ADDRESS $ANVIL_ADDRESS | jq -r '.deployedTo')
echo "Funder deployed to: $FUNDER_ADDRESS"

echo "Deploying Escrow..."
ESCROW_ADDRESS=$(forge create Escrow --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY | jq -r '.deployedTo')
echo "Escrow deployed to: $ESCROW_ADDRESS"

echo "Deploying ExperimentERC20..."
EXP1_ADDRESS=$(forge create ExperimentERC20 --config-path ./demo/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args "ExperimentERC20" "EXP" 1ether | jq -r '.deployedTo')
echo "ExperimentERC20 deployed to: $EXP1_ADDRESS"

EXP2_ADDRESS=$(forge create ExperimentERC20 --config-path ./demo/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args "ExperimentERC20" "EXP2" 10ether | jq -r '.deployedTo')
echo "ExperimentERC20 deployed to: $EXP2_ADDRESS"

echo "Funding funder..."
cast rpc --rpc-url $RPC_URL anvil_setBalance $FUNDER_ADDRESS 0xDE0B6B3A7640000
echo "Funder funded."

echo "Setting gas wallets..."
GAS_WALLET_ADDRESSES="[$(for i in {0..19}; do cast wallet address --mnemonic "test test test test test test test test test test test junk" --mnemonic-index $i; done | tr '\n' ',' | sed 's/,$//')]"
cast send --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY $FUNDER_ADDRESS 'setGasWallet(address[],bool)' "$GAS_WALLET_ADDRESSES" true
echo "Gas wallets set."

cp /app/relay.yaml /app/shared/relay.yaml

yq -i ".orchestrator = \"$ORCHESTRATOR_ADDRESS\"" /app/shared/relay.yaml
yq -i ".delegation_proxy = \"$ACCOUNT_PROXY_ADDRESS\"" /app/shared/relay.yaml
yq -i ".simulator = \"$SIMULATOR_ADDRESS\"" /app/shared/relay.yaml
yq -i ".funder = \"$FUNDER_ADDRESS\"" /app/shared/relay.yaml
yq -i ".escrow = \"$ESCROW_ADDRESS\"" /app/shared/relay.yaml

yq -i ".chain.fee_tokens[1] = \"$EXP1_ADDRESS\"" /app/shared/relay.yaml
yq -i ".chain.fee_tokens[2] = \"$EXP2_ADDRESS\"" /app/shared/relay.yaml
yq -i ".chain.interop_tokens[0] = \"$EXP1_ADDRESS\"" /app/shared/relay.yaml
yq -i ".chain.interop_tokens[1] = \"$EXP2_ADDRESS\"" /app/shared/relay.yaml

touch /app/shared/registry.yaml

yq -i ".31337[0].address = \"$EXP1_ADDRESS\"" /app/shared/registry.yaml
yq -i ".31337[0].kind = \"USDT\"" /app/shared/registry.yaml
yq -i ".31337[1].address = \"$EXP2_ADDRESS\"" /app/shared/registry.yaml
yq -i ".31337[1].kind = \"USDT\"" /app/shared/registry.yaml
yq -i ".31337[2].kind = \"ETH\"" /app/shared/registry.yaml