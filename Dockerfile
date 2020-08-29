# ###############
# STAGE ONE
# ###############
ARG ARCH=
FROM ${ARCH}alpine:edge AS builder
WORKDIR /opt/micro

COPY package.json .

# add nodejs and build deps
# nodejs install separate so we use a cached version in stage two
RUN apk add --update --no-cache nodejs-current nodejs-npm
RUN apk add vips-dev fftw-dev build-base python2 --update --no-cache \
    --repository https://mirror.aarnet.edu.au/pub/alpine/edge/testing/ \
    --repository https://mirror.aarnet.edu.au/pub/alpine/edge/main/

# install dependencies
# --dev flag to install devDependencies required for a build
# in the future not including dev dependencies in the final image would save a fair bit
RUN npm i -g yarn
RUN yarn install --dev

# build micro
COPY . ./
RUN yarn build 

# ###############
# STAGE TWO
# ###############
FROM ${ARCH}alpine:edge
WORKDIR /opt/micro

# add nodejs and runtime dependencies
# nodejs install separate for caching from stage one
RUN apk add --update --no-cache nodejs-current nodejs-npm
RUN apk add vips fftw --no-cache \
    --repository https://mirror.aarnet.edu.au/pub/alpine/edge/testing/ \
    --repository https://mirror.aarnet.edu.au/pub/alpine/edge/main/

# copy dependencies and built files over
COPY --from=builder /opt/micro/node_modules .
COPY --from=builder /opt/micro/dist .
COPY package.json package.json

ENV NODE_ENV=production
CMD ["yarn", "start"]
EXPOSE 8080