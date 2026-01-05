from django.urls import path
from .views import report_list, report_detail

urlpatterns = [
    path("", report_list, name="reports"),
    path("<int:pk>/", report_detail, name="report_detail"),
]
