from django.urls import path
from .views import AskView
from .views import StartThreadView, ThreadDetailView, SendMessageView

urlpatterns = [
    path("thread/start/", StartThreadView.as_view(), name="support-thread-start"),
    path("thread/<int:thread_id>/", ThreadDetailView.as_view(), name="support-thread-detail"),
    path("thread/<int:thread_id>/send/", SendMessageView.as_view(), name="support-thread-send"),
    path("ask/", AskView.as_view(), name="ask"),
]
