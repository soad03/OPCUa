FROM node:10

WORKDIR /usr

COPY package.json ./

COPY . .

# COPY ./client.ts ./

COPY ./L5.ts ./

COPY ./Logger.ts ./

RUN npm install

EXPOSE 4005 

RUN npm install typescript

RUN npm install -g ts-node

CMD [ "ts-node", "./L5.ts" ]
