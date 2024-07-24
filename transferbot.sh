#!/bin/sh

set -eu
set -o pipefail

trap finish EXIT INT TERM

finish () {
  exit_code=$?;
  if [ ! -z "${CALLBACK_ON_SUCCESS:-}" ] && [ "$exit_code" = 0 ]; then
    sh -c "$CALLBACK_ON_SUCCESS"
  elif [ ! -z "${CALLBACK_ON_FAILURE:-}" ] && [ "$exit_code" != 0 ]; then
    sh -c "$CALLBACK_ON_FAILURE"
  fi
}

source_wiki_origin="$1"
shift
target_wiki_origin="$1"
shift

{
cat <<CREDS
{
  "credentials": {
    "${target_wiki_origin}": {
      "oauth": {
        "consumer_key": "${TARGET_WIKI_OAUTH_CONSUMER_TOKEN}",
        "consumer_secret": "${TARGET_WIKI_OAUTH_CONSUMER_SECRET}",
        "token": "${TARGET_WIKI_OAUTH_ACCESS_TOKEN}",
        "token_secret": "${TARGET_WIKI_OAUTH_ACCESS_SECRET}"
      }
    }
  }
}
CREDS
} > $(wb config path)

wb data $@ --instance "$source_wiki_origin" |\
  mangle_data -t "$target_wiki_origin" -p type -p labels -p descriptions -p aliases -p datatype |\
  wb create-entity --batch --instance "$target_wiki_origin"
