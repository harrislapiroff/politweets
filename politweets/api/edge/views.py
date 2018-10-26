import datetime

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from rest_framework.response import Response

from politweets.models import Tweet
from politweets.api.edge.utils import (
    party_breakdown,
    tweet_summary,
    hour_breakdown,
    day_breakdown,
)


class SummaryView(APIView):

    @method_decorator(cache_page(60*5))
    def get(self, request, format=None):
        past_day_tweets = Tweet.objects.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=1),
        )
        past_week_tweets = Tweet.objects.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=7),
        )
        past_month_tweets = Tweet.objects.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=30),
        )

        return Response({
            'past_day': party_breakdown(past_day_tweets, tweet_summary),
            'past_week': party_breakdown(past_week_tweets, tweet_summary),
            'past_month': party_breakdown(past_month_tweets, tweet_summary),
        })


class HashtagDetailView(APIView):

    @method_decorator(cache_page(60*5))
    def get(self, request, hashtag=None, format=None):
        """
        Returns:

        * the past day of tweets using hashtag, broken down by hour
        * the past week of tweets using hashtag, broken down by day
        * the past month of tweets using hashtag, broken down by day
        """
        hashtagged_tweets = Tweet.objects.filter(
            text__icontains='#{}'.format(hashtag)
        )

        past_day_tweets = hashtagged_tweets.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=1),
        )

        past_week_tweets = hashtagged_tweets.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=7),
        )

        past_month_tweets = hashtagged_tweets.filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=30),
        )

        return Response({
            'past_day': party_breakdown(past_day_tweets, hour_breakdown),
            'past_week': party_breakdown(past_week_tweets, day_breakdown),
            'past_month': party_breakdown(past_month_tweets, day_breakdown),
        })


summary_view = SummaryView.as_view()
hashtag_view = HashtagDetailView.as_view()
