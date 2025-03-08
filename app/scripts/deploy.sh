#!/usr/bin/env bash

set -eoux pipefail

rm -rf ./dist

pnpm tsc --build
pnpm vite build

cp -R ./dist/client/ ./dist/
rm -rf ./dist/client