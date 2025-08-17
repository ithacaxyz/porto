#!/usr/bin/env bash

set -eou pipefail

# clean pnpm-lock.yaml
rm -rf pnpm-lock.yaml

# clean node_modules recursively, dist recursively, .tanstack, and *.tsbuildinfo recursively
find . \( \
    -name "node_modules" -o \
    -name "dist" -o \
    -name "_dist" -o \
    -name ".tanstack" -o \
    -name "*.tsbuildinfo" \
\) -prune -exec rm -rf {} + 2>/dev/null || true