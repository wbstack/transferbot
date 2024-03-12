FROM node:20-alpine

RUN apk add --no-cache jq && \
	npm install -g wikibase-cli@17.0.8

COPY --chmod=755 ./transferbot.sh /usr/bin/transferbot

ENTRYPOINT ["transferbot"]
