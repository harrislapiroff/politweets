from typing import TYPE_CHECKING

from politweets.models import Member
from politweets.utils.analysis.hashtags import hashtag_counts

if TYPE_CHECKING:
    from django.db.models import QuerySet  # NOQA: F401


def analysis_suite(tweets: 'QuerySet'):
    return {
        'total_tweets': tweets.count(),
        'popular_hashtags': list(hashtag_counts(tweets))[0:10],
    }


def analysis_suite_by_party(tweets: 'QuerySet') -> dict:
    return {
        'democrats': analysis_suite(
            tweets.filter(member__party=Member.DEMOCRAT)
        ),
        'republicans': analysis_suite(
            tweets.filter(member__party=Member.REPUBLICAN)
        ),
        'independents': analysis_suite(
            tweets.filter(member__party=Member.INDEPENDENT)
        ),
    }
