#!/usr/bin/env bash

set -euo pipefail

# remove all node_modules, dist, build, _dist, .output, recursively
/usr/bin/find . -type d \( \
  -name "node_modules" -o \
  -name "dist" -o \
  -name "build" -o \
  -name "_dist" -o \
  -name ".output" \
\) -exec rm -rf {} +