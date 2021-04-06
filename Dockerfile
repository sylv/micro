FROM node:15-alpine
ENV NODE_ENV development

# install build dependencies
WORKDIR /usr/src/micro
COPY package.json yarn.lock ./
RUN yarn install
RUN npm i -g prisma

# copy src and build
COPY . .
RUN prisma generate
RUN yarn build

CMD ["npm", "run", "start"]

# todo: this should be a multistage build that yeets dev dependencies once
# the app is built. that would probably cut the image size in half.