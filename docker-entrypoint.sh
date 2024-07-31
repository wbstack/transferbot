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

transferbot $@
