FROM node:18-alpine AS deps
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache libc6-compat make clang build-base python3
RUN npm i -g pnpm

WORKDIR /usr/src/micro

COPY pnpm-lock.yaml pnpm-workspace.yaml ./ 
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch




FROM node:18-alpine AS builder 
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/micro

RUN apk add --no-cache git
RUN npm i -g pnpm

COPY --from=deps /usr/src/micro .
COPY . .

# install all deps
RUN pnpm install --offline --frozen-lockfile
# build everthing
RUN pnpm build

# use "pnpm deploy" to prune the api into a smaller package
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    cd packages/api && pnpm --filter @ryanke/micro-api --prod deploy pruned




FROM node:18-alpine AS runner 
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/micro

RUN apk add --no-cache ffmpeg

# copy file dependencies
COPY --from=builder /usr/src/micro/packages/web/public ./packages/web/public
COPY --from=builder /usr/src/micro/packages/web/next.config.js ./packages/web/next.config.js

# copy web
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/.next/standalone/ ./
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/.next/static ./packages/web/.next/static/

# copy api
COPY --from=builder --chown=node:node /usr/src/micro/packages/api/pruned ./packages/api


COPY wrapper.sh .
RUN chmod +x ./wrapper.sh

USER node

ENTRYPOINT ["./wrapper.sh"]