# CLAUDE.md - AI Assistant Guide for Porto

This file provides essential information for Claude AI (and other AI assistants) working with the Porto codebase.

## About Porto

Porto is a Next-Generation Account Stack for Ethereum that provides a secure, scalable, and user-friendly account system. It's built as a TypeScript monorepo with multiple integrations and applications.

## Helpful Links

- [Porto Docs](https://porto.sh)
- [Porto `llms.txt`](https://porto.sh/llms.txt)
- [Porto `llms-full.txt`](https://porto.sh/llms-full.txt)

## Binaries

### Required

- **[Node.js](https://nodejs.org/en/download/):** `>= 22.5`
- **[pnpm](https://pnpm.io/installation):** `>= 10`

### Optional: For Tests

- **[Docker](https://docs.docker.com/get-docker):** `>= 27.0.0`
- **[Playwright](https://playwright.dev/docs/intro#installing-playwright):** `>= 1.51`
- **[Foundry](https://getfoundry.sh/introduction/installation):** `>= 1`

## Commands

### Install

```bash
pnpm install                   # Install dependencies
```

### Development

```bash
pnpm build                     # Build the core library
pnpm dev                       # Link library & run dev servers (playground, dialog, id)
pnpm dev:anvil                 # Run `pnpm dev` with local RPC Server
pnpm dev:wagmi                 # Run `pnpm dev` with wagmi playground
```

### Testing

```bash
foundryup --install nightly    # Foundry setup

pnpm build:contracts           # Build Contracts with Foundry (optional)
pnpm build:anvil-state         # Build Anvil State (optional)
pnpm test                      # Run default test suite with Vitest
pnpm test:browser              # Run browser-based tests (Chromium, Firefox)
```

### Code Quality

```bash
pnpm check                    # Run Biome linter and formatter
pnpm check:types              # Type checking across all packages
pnpm check:build              # Validate build outputs with publint and attw
pnpm check:size               # Check bundle size limits
pnpm check:repo               # Check repository structure with sherif
pnpm check:knip               # Check for unused dependencies with knip
pnpm check:markdown           # Lint markdown files
```

### Contract Development

```bash
foundryup --install nightly    # Foundry setup

# Account contracts
forge build --config-path ./contracts/account/foundry.toml
forge test --config-path ./contracts/account/foundry.toml

# Demo contracts  
forge build --config-path ./contracts/demo/foundry.toml
forge test --config-path ./contracts/demo/foundry.toml
```

## Directory Structure

- `apps/`: Applications
- `contracts/`: Contracts
  - The Porto Account contracts are a submodule under the `account/` directory
- `src/`: `porto` library source
  - Files are represented as modules
  - Files (modules) that are not exposed to the public API are stored in an `internal/` directory
- `scripts/`: Development scripts
- `test/`: Test configuration and utilities

## Project Overview

### Library (`src/`)

#### External Dependencies

- **`viem`** - TypeScript Interface for Ethereum
- **`wagmi`** - React Hooks for Ethereum
- **`ox`** - Standard Library for Ethereum
- **`@sinclair/typebox`** - Runtime schema validation

#### Core Modules (`src/core/`)

- **`Porto`** - Main stateful Porto module that links together all other modules
- **`Chains`** - Supported Porto chains and their configuration (e.g. RPC Server endpoints, chain ID, etc.)
- **`Dialog`** - Dialog instances
- **`Messenger`** - Cross-document communication
- **`Mode`** - Account orchestration mode (e.g. `dialog`, `rpcServer`, `contract`)
- **`Storage`** - Storage interfaces
- **`RpcSchema`** - RPC method schemas and types
- Internal modules are stored in an `internal/` directory

#### Viem Modules (`src/viem/`)

- **`Account`** - Viem Account abstraction for Porto Accounts
- **`Key`** - Account key management and cryptographic operations (e.g. `secp256k1`, `p256`, `webauthn-p256`)
- **`ContractActions`** - Actions for the Ithaca Account contract.
- **`ServerActions`** - Actions for the RPC Server
- **`ServerClient`** - Client helpers for the RPC Server
- **`WalletActions`** - Actions for the Porto Dialog (EIP-1193 Provider)
- **`WalletClient`** - Client helpers for the Porto Dialog (EIP-1193 Provider)

#### Wagmi Modules (`src/wagmi/`)

- **`Actions`** - Wagmi Actions
- **`Connector`** - Wagmi Connector
- **`Hooks`** - React Hooks
- **`Query`** - Wagmi Query utilities

### Applications (`apps/`)

- **`docs/`** - Documentation site for the SDK (library), RPC Server and Contracts
- **`dialog/`** - Dialog application (`id.porto.sh/dialog`)
- **`playground/`** - Development playground
- **`id/`** - Account management application (`id.porto.sh`)
- **`faucet/`** - Fee token faucet worker (for development)
- **`wagmi/`** - Wagmi development playground
- **`verify/`** - Application verification worker

### Contracts (`contracts/`)

- **`account/`** - Core account abstraction contracts
- **`demo/`** - Demo and example contracts

## Development Workflow

### Making Changes

1. **Create a feature branch**: Against `main`, named `claude/feature-name`
2. **Develop features**: Ensure to add any relevant tests for new functionality
3. **Run tests**: `pnpm test` and `pnpm test:browser`
4. **Check code quality**: `pnpm check`
5. **Build and validate**: `pnpm build && pnpm check:build`
6. **Add changeset**: If any public API or behavioral changes were made to the library (`src/`), add a changeset with `pnpm changeset`. Changesets should use past tense verbs (e.g. `Added new feature`). Any breaking changes should be noted with a `**Breaking:**` prefix with a description of how to migrate.
7. **Submit a PR**: Ensure PR title is in conventional commit format (e.g. `feat: add new feature`) and PR description is detailed

### Testing Strategy

- **Unit/Integration Tests**: Vitest with coverage reporting
- **Browser/E2E Tests**: Vitest Browser mode (Playwright with Chromium, Firefox and WebKit).

### PR Requirements

- All tests must pass (`pnpm test && pnpm test:browser`)
- Code must be properly formatted (`pnpm check`)
- Types must be valid (`pnpm check:types`)
- Build must succeed (`pnpm build`)
- Bundle size limits must be respected (`pnpm check:size`)
- No unused dependencies (`pnpm check:knip`)

This file should be updated when major architectural changes are made to the codebase.
