#!/bin/sh

# Define a cleanup function
cleanup() {
    pkill -P $$
}

# Trap signals and errors
trap cleanup EXIT HUP INT QUIT PIPE TERM ERR

cd packages/api && npm run start &
cd packages/web && HOST=0.0.0.0 npm run start &

wait -n
exit $?