FROM node:20-alpine

RUN apk add --no-cache jq=1.7.1-r0 curl=8.8.0-r0 && \
	npm install -g wikibase-cli@18.0.3

COPY --chmod=755 ./transferbot.sh /usr/bin/transferbot

ENTRYPOINT ["transferbot"]
