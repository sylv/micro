FROM node:15-alpine
ENV NODE_ENV development

# install dependencies
WORKDIR /micro
COPY package.json yarn.lock ./
COPY ./packages/web/package.json ./packages/web/
COPY ./packages/api/package.json ./packages/api/

# bundle source
RUN yarn install
COPY . .

# build api
WORKDIR /micro/packages/api
RUN yarn build

# build web
WORKDIR /micro/packages/web
RUN yarn build

ENV NODE_ENV production
CMD ["yarn", "start"]