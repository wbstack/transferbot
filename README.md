# transferbot

A Docker image providing a command that transfers entities from a source to a target wiki.

## Usage

```
docker run --rm ghcr.iowbstack/transferbot \
	https://source.wikibase.cloud https://target.wikibase.cloud Q1 P1 Q2
```

Positional arguments to be passed are:
1. The origin of the source wiki
2. The origin of the target wiki
3. (variadic) A whitespace separated list of entities to be transferred

---

## Providing credentials

OAuth 1.0 credentials for the __target wiki__ are provided using the following environment variables:

### `TARGET_WIKI_OAUTH_CONSUMER_TOKEN` (required)

The OAuth consumer token used for authenticating against the target wiki.

### `TARGET_WIKI_OAUTH_CONSUMER_SECRET` (required)

The OAuth consumer secret used for authenticating against the target wiki.

### `TARGET_WIKI_OAUTH_ACCESS_TOKEN` (required)

The OAuth access token used for authenticating against the target wiki.

### `TARGET_WIKI_OAUTH_ACCESS_SECRET` (required)

The OAuth access secret used for authenticating against the target wiki.

---

This work is distributed under the [BSD 3-Clause license](./LICENSE).
