FROM node:16-alpine3.15 AS development

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN apk add fpc --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing
RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
RUN apk add fpc --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
RUN node -v
CMD ["node", "dist/main"]
