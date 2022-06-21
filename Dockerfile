FROM node:16-bullseye AS development

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN apt-get update && apt-get install -y fpc
RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

FROM node:16-bullseye as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y fpc

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
RUN node -v
CMD ["node", "dist/main"]
