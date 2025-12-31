
# backend/contacts/urls.py
from django.urls import path
from .views import ContactView, ContactCsrfView

urlpatterns = [
    path('', ContactView.as_view(), name='contact'),          # /api/contacts/
    path('csrf/', ContactCsrfView.as_view(), name='contact_csrf'),  # /api/contacts/csrf/
]
