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

read_entities() {
  # entities are passed as either
  # "Q42" which fetches the latest revision
  # "Q42@123" which fetches revision 123
  for entity in $@; do
    case $entity in
      *@*)
        revision=$(echo $entity | cut -d "@" -f 2)
        id=$(echo $entity | cut -d "@" -f 1)
        wb data "$id" --revision "$revision" --instance "$source_wiki_origin"
      ;;
      *)
        wb data "$entity" --instance "$source_wiki_origin"
      ;;
    esac
  done
}

read_entities $@ |\
  mangle_data -t "$target_wiki_origin" -p type -p labels -p descriptions -p aliases -p datatype |\
  wb create-entity --batch --instance "$target_wiki_origin"
