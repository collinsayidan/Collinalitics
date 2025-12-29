
from django.urls import path
from .views import ContactView, ContactCsrfView

urlpatterns = [
    path('contact/', ContactView.as_view(), name='contact'),
    path('contact/csrf/', ContactCsrfView.as_view(), name='contact_csrf'),  # <-- ADD
]
