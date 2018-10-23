import datetime

from rest_framework.views import APIView
from rest_framework.response import Response

from politweets.models import Tweet
from politweets.utils.analysis.hashtags import quick_hashtag_count


class SummaryView(APIView):
    def get(self, request, format=None):
        # Past day
        past_day_tweets = Tweet.objects.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=1),
        )
        past_day_hashtags = quick_hashtag_count(past_day_tweets)

        # Past week
        past_week_tweets = Tweet.objects.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=7),
        )
        past_week_hashtags = quick_hashtag_count(past_week_tweets)

        return Response({
            'past_day': {
                'total_tweets': past_day_tweets.count(),
                'past_day_hashtags': list(past_day_hashtags)[0:20],
            },
            'past_week': {
                'total_tweets': past_week_tweets.count(),
                'past_week_hashtags': list(past_week_hashtags)[0:20],
            }
        })


summary_view = SummaryView.as_view()
