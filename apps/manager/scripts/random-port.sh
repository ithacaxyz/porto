#!/usr/bin/env bash

set -eou pipefail

# assumes lsof is available on the system (macOS should have it)

# check if USE_RANDOM_PORT is set to true
if [ "$USE_RANDOM_PORT" != "true" ]; then
  echo "USE_RANDOM_PORT is not set to true"
  exit 0
fi

# exit if lsof is not installed
if ! command -v lsof &> /dev/null; then
  echo "lsof could not be found"
  exit 1
fi

is_port_in_use() {
  local port=$1
  # Check if port is in use using lsof
  lsof -i :"$port" > /dev/null 2>&1
  return $?
}

get_random_port() {
  local port
  while true; do
    # Generate a random port in the range 3000-6553
    port=$((RANDOM % (6553 - 3000 + 1) + 3000))
    # Skip ports 5173 and 5174
    if [ $port -ne 5173 ] && [ $port -ne 5174 ]; then
      if ! is_port_in_use $port; then
        echo $port
        return
      fi
    fi
  done
}

# Get a random open port
RANDOM_PORT=$(get_random_port)

echo "$RANDOM_PORT"

export RANDOM_PORT
