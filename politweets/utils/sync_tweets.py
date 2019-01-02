import datetime
from collections import namedtuple
from typing import List

from django.conf import settings
from TwitterAPI import TwitterAPI

from politweets.models import Tweet, Member
from politweets.utils.congress import current_congress_session

SUCCESS = 'Success'
ERROR = 'Error'


api = TwitterAPI(
    settings.TWITTER_CONSUMER_KEY,
    settings.TWITTER_CONSUMER_SECRET,
    settings.TWITTER_ACCESS_TOKEN,
    settings.TWITTER_ACCESS_TOKEN_SECRET,
)


Result = namedtuple(
    'Result',
    ['status', 'member', 'exception', 'tweets'],
    defaults={'exception': None, 'tweets': None}
)


def sync_twitter_account(member: Member, overwrite: bool = False) -> List[Tweet]:
    """
    Sync twitter accounts for every member in the database. If overwrite is
    True, it will delete and recreate up the most recent 200 tweets from that
    member. Otherwise it will just create new ones.
    """

    params = {
        'screen_name': member.twitter,
        'count': 200,
        'include_rts': False,
        'tweet_mode': 'extended',
    }

    if not overwrite:
        try:
            most_recent_tweet = member.tweets.latest()
            params['since_id'] = most_recent_tweet.twitter_tweet_id
        except Tweet.DoesNotExist:
            pass

    res = api.request('statuses/user_timeline', params)

    # TODO: if we have a most recent tweet page through tweets in case there's
    # still more tweets that haven't been synced past the first page

    tweets = []
    ids = []
    for tweet in res:
        tweets.append(Tweet(
            member=member,
            twitter_tweet_id=tweet['id'],
            time=datetime.datetime.strptime(
                tweet['created_at'],
                '%a %b %d %H:%M:%S %z %Y'
            ),
            text=tweet['full_text'],
            source=tweet['source'],
            original_data=tweet
        ))
        ids.append(tweet['id'])

    if overwrite:
        Tweet.objects.filter(twitter_tweet_id__in=ids).delete()

    return Tweet.objects.bulk_create(tweets)


def sync_all_tweets(overwrite: bool = False):
    current_members = Member.objects.filter(
        twitter__isnull=False,
        session=current_congress_session()
    )
    for member in current_members:
        try:
            tweets = sync_twitter_account(member, overwrite=overwrite)
        except Exception as e:
            # An exception should not nuke the whole process. Just make a note
            # of the particular exception and move on
            yield Result(ERROR, member, exception=e)
        else:
            yield Result(SUCCESS, member, tweets=tweets)
