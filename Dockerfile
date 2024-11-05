FROM node:latest as build

WORKDIR /app

COPY . .

RUN npm i -g pnpm 

RUN pnpm install

RUN npm i -g pm2

RUN mkdir -p /app/logs

EXPOSE 5000

ARG ENV=dev

# CMD ["sh", "-c", "pm2 start ${ENV}-ecosystem.config.json --no-daemon"]
CMD ["/bin/sh", "-c", "pm2-runtime start ecosystem.config.json"]