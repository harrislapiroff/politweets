from politweets.api.edge import views
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('api/edge/summary/', views.summary_view),
    path('', TemplateView.as_view(template_name="index.html")),
]
