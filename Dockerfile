FROM node:18.20.4

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN mkdir app
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm db:push
RUN pnpm build


ENTRYPOINT ["./docker-entrypoint.sh"]