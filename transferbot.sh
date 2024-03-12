#!/bin/sh

set -eu

source_wiki_origin=$1
shift
target_wiki_origin=$1
shift

{
cat <<CREDS
{
  "credentials": {
    "${target_wiki_origin}": {
      "oauth": {
        "consumer_key": "${TARGET_WIKI_OAUTH_CONSUMER_KEY}",
        "consumer_secret": "${TARGET_WIKI_OAUTH_CONSUMER_SECRET}",
        "token": "${TARGET_WIKI_OAUTH_TOKEN}",
        "token_secret": "${TARGET_WIKI_OAUTH_TOKEN_SECRET}"
      }
    }
  }
}
CREDS
} > $(wb config path)

wb data $@ -i "$source_wiki_origin" |\
  jq -c '{type,labels,descriptions,aliases,datatype}' |\
  wb create-entity --batch -i "$target_wiki_origin"
