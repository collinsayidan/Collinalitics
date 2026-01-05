from django.urls import path
from .views import inbox, conversation_view

urlpatterns = [
    path("", inbox, name="inbox"),
    path("<int:pk>/", conversation_view, name="conversation"),
]
