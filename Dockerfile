FROM node:15-alpine AS builder
ENV NODE_ENV development

# install build dependencies
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install

# copy src and build
COPY . .
RUN yarn build

# dont copy node_modules to next stage
# https://stackoverflow.com/a/56566461/11783069
RUN rm -rf ./node_modules

FROM node:15-alpine
ENV NODE_ENV production

# install production dependencies
WORKDIR /usr/src/micro
COPY package.json yarn.lock ./
RUN yarn install

# copy built app from builder
COPY --from=builder /build/public public
COPY --from=builder /build/.next .next

CMD ["npm", "run", "start"]