FROM node:16-alpine AS deps
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm

WORKDIR /usr/src/micro

COPY pnpm-lock.yaml pnpm-workspace.yaml ./ 
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch




FROM node:16-alpine AS builder 
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/micro

RUN apk add --no-cache git
RUN npm i -g pnpm

COPY --from=deps /usr/src/micro .
COPY . .

RUN pnpm install --offline --frozen-lockfile
RUN pnpm build




FROM node:16-alpine AS runner 
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/micro

RUN apk add --no-cache ffmpeg

# copy file dependencies
COPY --from=builder /usr/src/micro/packages/web/public ./packages/web/public
COPY --from=builder /usr/src/micro/packages/web/next.config.js ./packages/web/next.config.js

# copy web server
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/.next/standalone/ ./
COPY --from=builder --chown=node:node /usr/src/micro/packages/web/.next/static ./packages/web/.next/static/

# copy api
COPY --from=builder --chown=node:node /usr/src/micro/packages/api/dist ./packages/api/dist
COPY --from=builder --chown=node:node /usr/src/micro/packages/api/dist ./packages/api/dist


COPY wrapper.sh .
RUN chmod +x ./wrapper.sh

USER node

ENTRYPOINT ["./wrapper.sh"]