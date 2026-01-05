from django.urls import path
from .views import training_list, training_detail, certificate_view, training_analytics, quiz_view

urlpatterns = [
    path("", training_list, name="training"),
    path("<int:pk>/", training_detail, name="training_detail"),
    path("certificate/", certificate_view, name="certificate"),
    path("analytics/", training_analytics, name="training_analytics"),
    path("<int:pk>/quiz/", quiz_view, name="quiz"),


]
