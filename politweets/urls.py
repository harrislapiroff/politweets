from politweets.api.edge import views
from django.urls import path

urlpatterns = [
    path('api/', views.summary_view),
]
