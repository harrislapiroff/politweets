import datetime
import json

from django.conf import settings
from TwitterAPI import TwitterAPI

from politweets.models import Tweet, Member

SUCCESS = 'Success'
ERROR = 'Error'



api = TwitterAPI(
    settings.TWITTER_CONSUMER_KEY,
    settings.TWITTER_CONSUMER_SECRET,
    settings.TWITTER_ACCESS_TOKEN,
    settings.TWITTER_ACCESS_TOKEN_SECRET,
)


def sync_twitter_account(member: Member):
    params = {
        'screen_name': member.twitter,
        'count': 200,
    }
    try:
        most_recent_tweet = member.tweets.latest()
        params['since_id'] = most_recent_tweet.twitter_tweet_id
    except Tweet.DoesNotExist:
        pass

    res = api.request('statuses/user_timeline', params)

    # TODO: if we have a most recent tweet page through tweets in case there's
    # still more tweets that haven't been synced past the first page

    tweets = []
    for tweet in res:
        tweets.append(Tweet(
            member=member,
            twitter_tweet_id=tweet['id'],
            time=datetime.datetime.strptime(
                tweet['created_at'],
                '%a %b %d %H:%M:%S %z %Y'
            ),
            text=tweet['text'],
            source=tweet['source'],
            original_data=json.dumps(tweet)
        ))
    return Tweet.objects.bulk_create(tweets)


def sync_all_tweets():
    members = Member.objects.filter(twitter__isnull=False, active=True)
    for member in members:
        try:
            result = sync_twitter_account(member)
        except Exception as e:
            # An exception should not nuke the whole process. Just make a note
            # of the particular exception and move on
            yield (ERROR, member, e)
        else:
            yield (SUCCESS, member, result)
