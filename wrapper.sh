#!/bin/bash

cd packages/api && npm run start &
cd packages/web && npm run start &

wait -n
exit $?