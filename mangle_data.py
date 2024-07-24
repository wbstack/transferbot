#!/usr/bin/env python3

import argparse
import json
import fileinput
from urllib import request

parser = argparse.ArgumentParser(
    description="Adjust a line from wb-cli so it can be fed into the target wiki"
)

parser.add_argument("-t", "--target", action="store", dest="target", required=True)
parser.add_argument("-p", "--pick", action="append", dest="pick", required=True)


def process_entity(line, pick=[], select_languages=set()):
    out = {}
    for key, value in line.items():
        if key not in pick:
            continue

        if not isinstance(value, dict):
            out[key] = value
            continue

        out[key] = {}
        for lang, value in line[key].items():
            if lang in select_languages:
                out[key][lang] = value

    return out


def get_contentlanguages(target_origin):
    with request.urlopen(
        f"{target_origin}/w/api.php?action=query&meta=wbcontentlanguages&format=json"
    ) as response:
        raw_body = response.read()
    body = json.loads(raw_body)
    return set(body["query"]["wbcontentlanguages"].keys())


def main():
    args = parser.parse_args()
    target_languages = get_contentlanguages(args.target)

    for line in fileinput.input("-"):
        out = process_entity(
            json.loads(line), pick=args.pick, select_languages=target_languages
        )
        print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
