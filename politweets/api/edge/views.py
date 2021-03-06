import datetime

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from rest_framework.response import Response

from politweets.models import Tweet
from politweets.api.edge.utils import (
    categories_breakdown,
    tweet_summary,
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
            'past_day': categories_breakdown(past_day_tweets, tweet_summary),
            'past_week': categories_breakdown(past_week_tweets, tweet_summary),
            'past_month': categories_breakdown(past_month_tweets, tweet_summary),
        })


class HashtagDetailView(APIView):

    @method_decorator(cache_page(60*5))
    def get(self, request, hashtag=None, format=None):
        """
        Returns the past thirty days of tweets with a given hashtag
        """

        hashtagged_tweets = Tweet.objects.with_hashtag(
            hashtag
        ).filter(
            time__gte=datetime.datetime.now() - datetime.timedelta(days=30)
        )

        results = [{
            'id': str(tweet.twitter_tweet_id),
            'time': tweet.time,
            'text': tweet.text,
            'member': {
                'first_name': tweet.member.first_name,
                'middle_name': tweet.member.middle_name,
                'last_name': tweet.member.last_name,
                'full_name': tweet.member.get_full_name(),
                'suffix': tweet.member.suffix,
                'party': tweet.member.party,
                'gender': tweet.member.gender,
                'chamber': tweet.member.chamber,
                'state': tweet.member.state,
                'district': tweet.member.district,
                'twitter': tweet.member.twitter,
                'avatar': tweet.original_data['user']['profile_image_url_https'],
            }
        } for tweet in hashtagged_tweets]

        return Response(results)


summary_view = SummaryView.as_view()
hashtag_view = HashtagDetailView.as_view()
