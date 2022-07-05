#!/bin/sh

cd packages/api && node ./dist/index.js &
cd packages/web && node ./server.js &

wait -n
exit $?