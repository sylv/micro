FROM node:14-alpine AS builder
RUN npm i -g pnpm
ENV NODE_ENV=development

# install development dependencies
WORKDIR /usr/src/micro
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# build with development dependencies
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:14-alpine
RUN npm i -g pnpm
ENV NODE_ENV=production

# install production dependencies
WORKDIR /usr/src/micro 
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --no-optional

# copy built app from the previous stage
COPY --from=builder /usr/src/micro/.next /usr/src/micro/.next

# run as the "node" user https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

# define how we want to start the app
CMD ["node", ".next/api/main.js"]
# CMD ["ls"]