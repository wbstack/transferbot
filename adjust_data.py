#!/usr/bin/env python3

import argparse
import json
import fileinput

parser = argparse.ArgumentParser(
    description="Adjust a line from wb-cli so it can be fed into the target wiki"
)

parser.add_argument("-s", "--source", action="store", dest="source", required=True)
parser.add_argument("-t", "--target", action="store", dest="target", required=True)
parser.add_argument("-p", "--pick", action="append", dest="pick", required=True)


def main():
    args = parser.parse_args()
    source = json.load(open(args.source))
    target = json.load(open(args.target))

    source_languages = source["query"]["wbcontentlanguages"].keys()
    target_languages = target["query"]["wbcontentlanguages"].keys()

    selected_languages = set(source_languages) & set(target_languages)

    for line in fileinput.input("-"):
        data = json.loads(line)
        out = {}
        for key, value in data.items():
            if key not in args.pick:
                continue

            if type(value) is not "dict":
                out[key] = value
                continue

            out[key] = {}
            for lang, value in data[key].items():
                if lang in selected_languages:
                    out[key][lang] = value

        print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
