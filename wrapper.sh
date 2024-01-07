#!/bin/sh

# Define a cleanup function
cleanup() {
    pkill -P $$
}

# Trap signals and errors
trap cleanup EXIT HUP INT QUIT PIPE TERM ERR

cd packages/api && bun run ./dist/main.js &
cd packages/web && node ./server.js &

wait -n
exit $?