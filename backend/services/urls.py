
# backend/services/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet  # add CategoryViewSet if you have it

router = DefaultRouter()
# Register the ServiceViewSet at the base ("") so list is at /api/services/
router.register(r"", ServiceViewSet, basename="service")

# If you have categories, expose them as a child route:
# from .views import CategoryViewSet
# router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path("", include(router.urls)),
]
