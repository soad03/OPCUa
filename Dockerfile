FROM node:16-alpine as buildstage

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update openssl

RUN npm install

COPY . .

RUN npm run build

FROM buildstage as devtest   

RUN npm run dev-test

FROM buildstage as prodtest   

RUN npm run prod-test

FROM node:16-alpine as deploy

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apk add --update openssl

COPY --from=buildstage /usr/src/app/build .

CMD ["node","index.js"]

