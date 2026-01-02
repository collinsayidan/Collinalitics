
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
    path("support/", include("support.urls")), # Support app URLs

    # Admin
    path("admin/", admin.site.urls),
     path('api/', include('ask.urls')),

    # APIs (separate prefixes per app to avoid conflicts)
    path("api/services/", include("services.urls")),
    path("api/portfolio/", include("portfolio.urls")),
    path("api/contacts/", include("contacts.urls")),
    path("api/blog/", include("blog.urls")),  # New blog app URLs
]
