FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3002

CMD [ "npm", "start"]
