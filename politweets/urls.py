from politweets.api.edge import views
from django.urls import path
from django.views.generic import TemplateView, RedirectView
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.views.decorators.cache import cache_page

urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url=static('favicon.png'))),

    path(
        'api/edge/summary/',
        views.summary_view,
        name='api_summary'
    ),
    path(
        'api/edge/hashtag/<hashtag>/',
        views.hashtag_view,
        name='api_hashtag'
    ),

    path('', cache_page(60*60*5)(
        TemplateView.as_view(template_name="index.html")
    )),
]
