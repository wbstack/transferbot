#!/bin/bash

set -eu
set -o pipefail

docker run --rm \
    -e TARGET_WIKI_OAUTH_CONSUMER_TOKEN \
    -e TARGET_WIKI_OAUTH_CONSUMER_SECRET \
    -e TARGET_WIKI_OAUTH_ACCESS_TOKEN \
    -e TARGET_WIKI_OAUTH_ACCESS_SECRET \
    ghcr.io/wbstack/transferbot:main \
    "$SOURCE_WIKI_URL" \
    "$TARGET_WIKI_URL" \
    "$@"