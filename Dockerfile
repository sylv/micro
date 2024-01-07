# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/micro
ENV NODE_ENV=production





# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev
COPY ./packages/api/package.json /temp/dev/packages/api/
COPY ./packages/web/package.json /temp/dev/packages/web/
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY ./packages/api/package.json /temp/prod/packages/api/
COPY ./packages/web/package.json /temp/prod/packages/web/
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production





# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules

COPY ./packages/web ./packages/web
RUN cd ./packages/web && bun run build

COPY ./packages/api ./packages/api
RUN cd ./packages/api && bun run build






# copy production dependencies and source code into final image
FROM base AS release
# necessary for sharp, apparently
RUN apk add --no-cache libstdc++

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/micro/packages/api/dist ./packages/api/dist
COPY --from=build /usr/src/micro/packages/api/package.json ./packages/api/
COPY --from=build /usr/src/micro/packages/web/.next/standalone ./packages/web/

COPY wrapper.sh .
RUN chmod +x ./wrapper.sh
RUN apk add --no-cache nodejs

# run the app
USER bun
EXPOSE 3000/tcp
CMD [ "./wrapper.sh" ]
