FROM node:14-alpine AS builder
RUN npm i -g pnpm
ENV NODE_ENV=development

# install development dependencies
WORKDIR /usr/src/micro

# build with development dependencies
COPY . .
RUN pnpm install --frozen-lockfile && \
 pnpm build && \
 pnpm prune --prod

# run as the "node" user https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
ENV NODE_ENV=production

# define how we want to start the app
CMD ["node", ".next/api/main.js"]