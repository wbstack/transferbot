#!/bin/bash

set -eu
set -o pipefail

docker run \
    --rm \
    --interactive \
    --tty \
    --env TARGET_WIKI_OAUTH_CONSUMER_TOKEN \
    --env TARGET_WIKI_OAUTH_CONSUMER_SECRET \
    --env TARGET_WIKI_OAUTH_ACCESS_TOKEN \
    --env TARGET_WIKI_OAUTH_ACCESS_SECRET \
    ghcr.io/wbstack/transferbot:main \
    "$SOURCE_WIKI_URL" \
    "$TARGET_WIKI_URL" \
    "$@"
