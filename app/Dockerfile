FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

RUN npm install -g http-server
CMD ["http-server", "dist/pokedex-app", "-p", "80"]
