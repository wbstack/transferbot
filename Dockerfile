FROM node:20-alpine

RUN apk add --no-cache curl=8.9.0-r0

COPY . /pkg
RUN npm i -g /pkg

ENTRYPOINT ["transferbot"]
