
# backend/config/urls.py
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

def index(request):
    return HttpResponse("Collinalitics backend is running.", content_type="text/plain")

def health(request):
    return HttpResponse("ok", content_type="text/plain")

urlpatterns = [
    # Root and health checks
    path("", index, name="index"),           # GET /
    path("health/", health, name="health"),  # GET /health/

    # Admin
    path("admin/", admin.site.urls),

    # APIs (separate prefixes per app to avoid conflicts)
    path("api/services/", include("services.urls")),
    path("api/portfolio/", include("portfolio.urls")),
    path("api/contacts/", include("contacts.urls")),
]
