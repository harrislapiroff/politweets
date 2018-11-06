from django.test import TestCase

from politweets.tests.factories import TweetFactory
from politweets.models import Tweet


class TweetQuerySetTestCase(TestCase):
    @classmethod
    def setUpTestData(kls):
        kls.t_beg = TweetFactory.create(text='#hashtag at beginning of tweet')
        kls.t_end = TweetFactory.create(text='tweet with hashtag at end #hashtag')
        kls.t_mid = TweetFactory.create(text='tweet with #hashtag in middle')
        kls.t_pun = TweetFactory.create(text='tweet with #hashtag, that is followed by punctuation')
        kls.t_cap = TweetFactory.create(text='tweet with #hAsHTaG with wacky caps')
        kls.t_two = TweetFactory.create(text='tweet with #hashtag twice #hashtag')
        kls.t_sup = TweetFactory.create(text='tweet with #hashtagsuperstring in middle')
        kls.t_url = TweetFactory.create(text='tweet with url http://example.com/#hashtag that is not a hashtag')
        kls.qs_by_hashtag = Tweet.objects.with_hashtag('#hashtag')
        kls.qs_by_hashtag_cs = Tweet.objects.with_hashtag('#hashtag', case_sensitive=True)

    def test_matches_hashtag__beginning(self):
        "A hashtag at the beginning of a tweet should match"
        self.assertIn(self.t_beg, self.qs_by_hashtag)

    def test_matches_hashtag__end(self):
        "A hashtag at the end of a tweet should match"
        self.assertIn(self.t_end, self.qs_by_hashtag)

    def test_matches_hashtag__middle(self):
        "A hashtag in the middle of a tweet should match"
        self.assertIn(self.t_mid, self.qs_by_hashtag)

    def test_matches_hashtag__punctuation(self):
        "A hashtag abutting punctuation should match"
        self.assertIn(self.t_pun, self.qs_by_hashtag)

    def test_matches_hashtag__case_insensitive(self):
        "Hashtag filtering should be case-insensitive by default"
        self.assertIn(self.t_cap, self.qs_by_hashtag)

    def test_matches_hashtag__double(self):
        "A tweet with the hashtag twice should match"
        self.assertIn(self.t_two, self.qs_by_hashtag)

    def test_not_matches_hashtag__superstring(self):
        "A hashtag that *contains* the filtered hashtag should *not* match"
        self.assertNotIn(self.t_sup, self.qs_by_hashtag)

    def test_not_matches_hashtag__url(self):
        "A tweet with a URL with an anchor should *not* match"
        self.assertNotIn(self.t_url, self.qs_by_hashtag)

    def test_not_matches_hashtag__case_sensitive(self):
        "Hashtag filtering should be case-sensitive when specified"
        self.assertNotIn(self.t_cap, self.qs_by_hashtag_cs)
