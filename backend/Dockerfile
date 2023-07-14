FROM node:18.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY app/config/ app/config/

CMD [ "npm", "start" ]
