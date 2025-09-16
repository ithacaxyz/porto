#!/usr/bin/env bash

set -euo pipefail

# remove all node_modules, recursively
/usr/bin/find . -name "node_modules" -type d -exec rm -rf {} +

# remove all dist, recursively
/usr/bin/find . -name "dist" -type d -exec rm -rf {} +

# remove all build, recursively
/usr/bin/find . -name "build" -type d -exec rm -rf {} +
