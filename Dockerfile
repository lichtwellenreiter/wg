FROM node:carbon

LABEL maintainer="Florian Thiévent"
LABEL version="0.0.1"
LABEL description="WeightGauges"

ARG port=3000

ENV SERVER_URL wg.thievent.org
ENV SERVER_PORT ${port}

RUN npm i -g concurrently

WORKDIR /app
COPY . /app
RUN npm i

EXPOSE ${port}

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'" "sleep 5s; node /app/server.js"
