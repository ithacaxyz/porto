#!/usr/bin/env bash

set -euo pipefail

# remove all node_modules, recursively
/usr/bin/find . -depth -type d -name "node_modules" -exec rm -rf {} +

# remove all dist, recursively
/usr/bin/find . -depth -type d -name "dist" -exec rm -rf {} +

# remove all build, recursively
/usr/bin/find . -depth -type d -name "build" -exec rm -rf {} +
