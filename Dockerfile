FROM node:20-alpine

RUN apk add --no-cache curl=8.9.0-r0

COPY . /pkg
RUN npm i -g /pkg
COPY --chmod=755 docker-entrypoint.sh /usr/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
