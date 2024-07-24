#!/usr/bin/env python3

import unittest
import urllib
from unittest.mock import MagicMock, patch

from mangle_data import process_entity, get_contentlanguages


class TestProcessEntity(unittest.TestCase):
    def test_empty(self):
        result = process_entity({})
        self.assertEqual(result, {})

    def test_skip_languages(self):
        result = process_entity(
            {
                "labels": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                    "de": {
                        "language": "de",
                        "value": "Pfeife",
                    },
                }
            },
            pick=["labels"],
            select_languages=["en", "fr"],
        )
        self.assertEqual(
            result,
            {
                "labels": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                }
            },
        )

    def test_pick_keys(self):
        result = process_entity(
            {
                "labels": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                    "de": {
                        "language": "de",
                        "value": "Pfeife",
                    },
                },
                "other": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                    "de": {
                        "language": "de",
                        "value": "Pfeife",
                    },
                },
            },
            pick=["labels"],
            select_languages=["en", "fr", "de"],
        )
        self.assertEqual(
            result,
            {
                "labels": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                    "de": {
                        "language": "de",
                        "value": "Pfeife",
                    },
                },
            },
        )

    def test_pick_non_dict(self):
        result = process_entity(
            {
                "type": "item",
                "labels": {
                    "en": {
                        "language": "en",
                        "value": "pipe",
                    },
                    "fr": {
                        "language": "fr",
                        "value": "pipe",
                    },
                    "de": {
                        "language": "de",
                        "value": "Pfeife",
                    },
                },
            },
            pick=["type"],
            select_languages=["en", "fr", "de"],
        )
        self.assertEqual(
            result,
            {
                "type": "item",
            },
        )


class TestGetContentlanguages(unittest.TestCase):
    @patch("urllib.request.urlopen")
    def test_success(self, mock_urlopen):
        cm = MagicMock()
        cm.read.return_value = '{"batchcomplete":"","query":{"wbcontentlanguages":{"aa":{"code":"aa"},"bb":{"code":"bb"}}}}'
        cm.__enter__.return_value = cm
        mock_urlopen.return_value = cm
        with urllib.request.urlopen(
            "https://test.wikibase.cloud/w/api.php?action=query&meta=wbcontentlanguages&format=json"
        ):
            result = get_contentlanguages("https://test.wikibase.cloud")
            self.assertSetEqual(result, {"aa", "bb"})


if __name__ == "__main__":
    unittest.main()
