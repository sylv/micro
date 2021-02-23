FROM node:15-alpine AS builder
ENV NODE_ENV development

# install dependencies
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install

# bundle source
COPY . .
RUN yarn build


FROM node:15-alpine
ENV NODE_ENV production

WORKDIR /usr/src/micro
COPY package.json ./
COPY --from=builder /build/.next ./.next
RUN yarn install

CMD ["yarn", "start"]