FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY .env.example ./.env

RUN npm ci
COPY --chown=node:node . .

RUN npm run build

FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
# Step 6: Start command
CMD ["node", "dist/main"]

