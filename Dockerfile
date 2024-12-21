FROM node:20-alpine3.18 AS base

ENV DIR /project
WORKDIR $DIR
ARG NPM_TOKEN

FROM base AS dev

ENV NODE_ENV=development

COPY package*.json $DIR

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $DIR/.npmrc && \
  npm i && \
  rm -f .npmrc

COPY . .

EXPOSE $PORT
CMD ["npm", "run", "start:dev"]

FROM base AS build

RUN apk update && apk add --no-cache dumb-init
ENV NODE_ENV=development
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
  npm install && \
  rm -f .npmrc
COPY . .
RUN npm run build

FROM base AS production

ENV NODE_ENV=production
ENV USER=node
ENV PORT=3000

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
  npm install --only=production && \
  rm -f .npmrc
COPY --from=build $DIR/dist $DIR/dist

USER $USER
EXPOSE $PORT
CMD ["dumb-init", "node", "dist/main.js"]