import datetime
from unittest.mock import patch

from django.test import TestCase

from politweets.utils.congress import (
    congress_session,
    current_congress_session,
)


class CongressUtilsTestCase(TestCase):
    def test_congress_session__december(self):
        """
        Congress session should accurately calculate the correct session
        for 2018
        """
        self.assertEqual(
            congress_session(datetime.date(year=2018, month=12, day=1)),
            115
        )

    def test_congress_session__early_january(self):
        "Congress session should not increment before January 3"
        self.assertEqual(
            congress_session(datetime.date(year=2019, month=1, day=2)),
            115
        )

    def test_congress_session__january_3(self):
        "Congress session should increment on January 3"
        self.assertEqual(
            congress_session(datetime.date(year=2019, month=1, day=3)),
            116
        )

    @patch('politweets.utils.congress.congress_session')
    def test_current_congress_session(self, congress_session_):
        """
        current_congress_session shortcut should call congress_session with
        today's date
        """
        current_congress_session()
        congress_session_.assert_called_once_with(datetime.date.today())
