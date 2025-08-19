# Repository Guidelines

## Project Structure & Module Organization
- src: Primary TypeScript library (package `porto`), CLI under `src/cli`, build output in `src/_dist`.
- apps/*: Example/demo applications (Vite-based) used during development.
- examples/*: Minimal, copyable examples integrating the library.
- test: Vitest workspace and test helpers; tests in `test/src`.
- contracts: Foundry projects for onchain components.
- scripts: Local build and release utilities (e.g., preconstruct, contracts tooling).

## Build, Test, and Development Commands
- pnpm install: Install deps (pnpm required). Initializes submodules on postinstall.
- pnpm dev: Start local apps (dialog, id, playground).
- pnpm build: Clean and compile library + CLI to `src/_dist`.
- pnpm test: Run Node Vitest suite; use `pnpm test:browser` for Playwright browser tests.
- pnpm check: Format/lint via Biome and repo checks; `pnpm check:types` for TS.
- pnpm preconstruct: Symlink exports for local dev (run automatically where needed).

## Coding Style & Naming Conventions
- Language: TypeScript (ES modules), Node >= 22.5.
- Formatting: Biome (2-space indent, single quotes, minimal semicolons). Run `pnpm format`.
- Imports/exports: Keep tree-shakeable ESM; avoid default exports in packages unless required.
- Naming: files kebab-case; symbols PascalCase for types/classes, camelCase for variables/functions.
- Do not commit generated files under `_` or `_dist`.

## Testing Guidelines
- Frameworks: Vitest (+ @vitest/browser with Playwright).
- Locations: `test/src/**/*.test.ts` and `*.browser.test.ts` for browser cases.
- Running: `pnpm test` (Node) or `pnpm test:browser` (browser); coverage via V8.
- Snapshots: Stored alongside tests in `_snapshots/` (see `test/vitest.config.ts`).

## Commit & Pull Request Guidelines
- Commit style: Conventional prefixes (feat, fix, chore, docs, ci, refactor, perf, test). Scope optional, e.g., `feat(dialog): ...`.
- PRs: Include clear description, linked issues, and repro steps; attach screenshots for UI/app changes.
- CI must pass: checks, types, build, size, and tests. Run `pnpm check && pnpm check:types && pnpm build && pnpm test` locally.
- Releases: Managed via Changesets; avoid manual version bumps outside the flow.

## Security & Configuration Tips
- Environment: Copy `.env.example` to `.env` when needed. Never commit secrets.
- Submodules: After clone, run `git submodule update --init --recursive`.
- Tooling: Foundry for `contracts/*` (see README), Vite for apps, pnpm only (enforced).
