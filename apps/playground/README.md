# Playground

## Development

```bash
pnpm dev:anvil
```

## Guides

### Testing Account Upgrades

#### 1. Start Development Environment

```bash
pnpm dev:anvil
```

#### 2. Navigate to the Playground

Head to [http://anvil.localhost:5173](http://anvil.localhost:5173)

#### 3. Register a new Account

Register a new account by clicking the `Register` button.

#### 4. Fund the Account

Fund your account with some EXP to pay fees.

```bash
cast send --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 0xe1aa25618fa0c7a1cfdab5d6b456af611873b629 'mint(address,uint256)' '{{address}}' '1000000000000000000000'
```

#### 5. Perform an Action

Perform any action with your account (e.g. "Mint 50 EXP" with `wallet_sendCalls`).

This will designate the Delegation contract as the Account's implementation.

#### 6. Upgrade the Relay

Head to [http://anvil.localhost:5173/relay/up](http://anvil.localhost:5173/relay/up) to upgrade the Relay to
point to the new Delegation contract.

#### 7. Perform another Action

Perform another action with your account (e.g. "Mint 50 EXP" with `wallet_sendCalls`).

When performing this action, you should be prompted to upgrade your account.

Alternatively, you can test this via `wallet_updateAccount`.
