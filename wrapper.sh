#!/bin/sh

cleanup() {
    pkill -P $$
}

trap cleanup EXIT HUP INT QUIT PIPE TERM ERR

(cd packages/api && npm run start) &
(cd packages/web && HOST=0.0.0.0 npm run start) &

wait -n
exit $?