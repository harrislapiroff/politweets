import itertools
from typing import TYPE_CHECKING

from politweets.models import Member
from politweets.utils.analysis.hashtags import hashtag_counts

if TYPE_CHECKING:
    from django.db.models import QuerySet  # NOQA: F401


def categories_breakdown(tweets: 'QuerySet', func: callable) -> dict:
    return {
        'democrats': func(tweets.filter(member__party=Member.DEMOCRAT)),
        'republicans': func(tweets.filter(member__party=Member.REPUBLICAN)),
        'independents': func(tweets.filter(member__party=Member.INDEPENDENT)),
        'men': func(tweets.filter(member__gender='M')),
        'women': func(tweets.filter(member__gender='F')),
        'representatives': func(tweets.filter(member__chamber=Member.HOUSE)),
        'senators': func(tweets.filter(member__chamber=Member.SENATE)),
    }


def tweet_summary(tweets: 'QuerySet') -> dict:
    return {
        'total_tweets': tweets.count(),
        'popular_hashtags': itertools.islice(hashtag_counts(tweets), 10),
    }
