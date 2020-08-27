From node:14-alpine 

WORKDIR /opt/micro
COPY package.json yarn.lock ./
RUN yarn install

ADD . ./
RUN npm run build

ENV NODE_ENV production
CMD [ "npm", "start" ]