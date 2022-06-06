#!/bin/bash

npm run start:api &
npm run start:web &

wait -n
exit $?