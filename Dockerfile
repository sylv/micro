FROM node:16-slim AS builder
RUN npm i -g pnpm@7 tsup
ENV NODE_ENV=development

# install development dependencies
WORKDIR /usr/src/micro
RUN apt update && apt install -y ffmpeg git

# copy package.jsons and install dependencies
# doing this before copying everything helps with caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json . 
COPY packages/web/package.json packages/web/package.json
COPY packages/thumbnail-generator/package.json packages/thumbnail-generator/package.json
COPY packages/api/package.json packages/api/package.json
RUN pnpm install --frozen-lockfile 

# copy sources and build app
COPY . .
RUN pnpm build

# prune unused packages
# RUN pnpm prune --prod


# run as the "node" user https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
RUN chmod +x ./wrapper.sh
USER node
ENV NODE_ENV=production

# define how we want to start the app
ENTRYPOINT ["./wrapper.sh"]