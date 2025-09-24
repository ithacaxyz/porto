set shell := ["fish", "-c"]
set dotenv-load := true
set positional-arguments := true

doctor:
    bun expo install --fix && npx expo-doctor --verbose --bun
    bun x expo config --full

build:
  pnpm clean && pnpm tsc --project ./tsconfig.build.json

build-cp-rn:
  just build && cp -R src/_dist ../porto-rn/