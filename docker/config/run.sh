ANVIL_ADDRESS=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
ANVIL_PRIVATE_KEY=0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
RPC_URL=http://anvil:8545

ACCOUNT_REGISTRY_ADDRESS=$(forge create AccountRegistry --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY | jq -r '.deployedTo')
ORCHESTRATOR_ADDRESS=$(forge create Orchestrator --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args 0x0000000000000000000000000000000000000000 | jq -r '.deployedTo')
ACCOUNT_ADDRESS=$(forge create PortoAccount --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args $ORCHESTRATOR_ADDRESS | jq -r '.deployedTo')
ACCOUNT_PROXY_ADDRESS=$(forge create EIP7702Proxy --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args $ACCOUNT_ADDRESS $ANVIL_ADDRESS | jq -r '.deployedTo')
SIMULATOR_ADDRESS=$(forge create Simulator --config-path ./account/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY | jq -r '.deployedTo')

EXP1_ADDRESS=$(forge create ExperimentERC20 --config-path ./demo/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args "ExperimentERC20" "EXP" 1ether | jq -r '.deployedTo')
EXP2_ADDRESS=$(forge create ExperimentERC20 --config-path ./demo/foundry.toml --json --broadcast --rpc-url $RPC_URL --private-key $ANVIL_PRIVATE_KEY --constructor-args "ExperimentERC20" "EXP2" 10ether | jq -r '.deployedTo')

echo "AccountRegistry deployed to: $ACCOUNT_REGISTRY_ADDRESS"
echo "Orchestrator deployed to: $ORCHESTRATOR_ADDRESS"
echo "Account deployed to: $ACCOUNT_ADDRESS"
echo "EIP7702Proxy deployed to: $ACCOUNT_PROXY_ADDRESS"
echo "Simulator deployed to: $SIMULATOR_ADDRESS"

echo "ExperimentERC20 deployed to: $EXP1_ADDRESS"
echo "ExperimentERC20 deployed to: $EXP2_ADDRESS"

cp /app/relay.yaml /app/shared/relay.yaml

yq -i ".orchestrator = \"$ORCHESTRATOR_ADDRESS\"" /app/shared/relay.yaml
yq -i ".account_registry = \"$ACCOUNT_REGISTRY_ADDRESS\"" /app/shared/relay.yaml
yq -i ".delegation_proxy = \"$ACCOUNT_PROXY_ADDRESS\"" /app/shared/relay.yaml
yq -i ".simulator = \"$SIMULATOR_ADDRESS\"" /app/shared/relay.yaml

yq -i ".chain.fee_tokens[1] = \"$EXP1_ADDRESS\"" /app/shared/relay.yaml
yq -i ".chain.fee_tokens[2] = \"$EXP2_ADDRESS\"" /app/shared/relay.yaml

touch /app/shared/registry.yaml

yq -i ".31337[0].address = \"$EXP1_ADDRESS\"" /app/shared/registry.yaml
yq -i ".31337[0].kind = \"USDT\"" /app/shared/registry.yaml
yq -i ".31337[1].address = \"$EXP2_ADDRESS\"" /app/shared/registry.yaml
yq -i ".31337[1].kind = \"USDT\"" /app/shared/registry.yaml
yq -i ".31337[2].kind = \"ETH\"" /app/shared/registry.yaml