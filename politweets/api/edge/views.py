import datetime

from rest_framework.views import APIView
from rest_framework.response import Response

from politweets.models import Tweet
from politweets.api.edge.utils import analysis_suite_by_party


class SummaryView(APIView):
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
            'past_day': analysis_suite_by_party(past_day_tweets),
            'past_week': analysis_suite_by_party(past_week_tweets),
            'past_month': analysis_suite_by_party(past_month_tweets),
        })


summary_view = SummaryView.as_view()
