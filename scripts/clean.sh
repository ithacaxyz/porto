#!/usr/bin/env bash

set -eou pipefail

# clean node_modules recursively
find . -name "node_modules" -type d -exec rm -rf {} +

# clean dist recursively
find . -name "dist" -type d -exec rm -rf {} +
find . -name "_dist" -type d -exec rm -rf {} +

# clean .tanstack recursively
find . -name ".tanstack" -type d -exec rm -rf {} +

# clean *.tsbuildinfo recursively
find . -name "*.tsbuildinfo" -type f -exec rm -rf {} +