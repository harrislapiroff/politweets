from politweets.api.edge import views
from django.urls import path

urlpatterns = [
    path('api/edge/summary/', views.summary_view),
]
