FROM node:14-alpine
ENV NODE_ENV development

RUN npm i -g pnpm

# install build dependencies
WORKDIR /usr/src/micro
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# copy src and build
COPY . .
RUN pnpm prisma generate
RUN pnpm build

CMD ["npm", "run", "start"]

# todo: this should be a multistage build that yeets dev dependencies once
# the app is built. that would probably cut the image size in half.