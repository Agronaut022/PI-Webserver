FROM node:14

WORKDIR /usr/tools/webserver

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["node", "."]

