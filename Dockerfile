FROM node:24-alpine AS build-base
RUN apk add --no-cache libc6-compat make clang build-base python3
RUN npm install --global pnpm@11.28.5
WORKDIR /usr/src/micro

FROM build-base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm test && pnpm build
RUN pnpm --filter @ryanke/micro-api deploy --prod --legacy /usr/src/api-pruned

FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/micro
RUN apk add --no-cache ffmpeg
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/dist/ ./packages/web/dist/
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/package.json ./packages/web/
COPY --from=builder --chown=node:node /usr/src/api-pruned ./packages/api
COPY --chown=node:node --chmod=755 wrapper.sh .
USER node
EXPOSE 3000 8080
ENTRYPOINT ["./wrapper.sh"]
