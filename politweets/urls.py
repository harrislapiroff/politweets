from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.views.decorators.cache import cache_page

from politweets.api.edge import views


urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url=static('favicon.png'))),

    path(
        'api/edge/summary/',
        views.summary_view,
        name='api_summary'
    ),
    path(
        'api/edge/tweets/',
        views.tweet_list_view,
        name='api_tweet_list'
    ),
    path(
        'api/edge/hashtag/<hashtag>/',
        views.hashtag_view,
        name='api_hashtag'
    ),

    re_path(r'^.*', cache_page(60*60*5)(
        TemplateView.as_view(template_name="index.html")
    )),
]
