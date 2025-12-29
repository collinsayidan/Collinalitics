
from django.db import models

class Inquiry(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    name = models.CharField(max_length=150)
    email = models.EmailField()
    company = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=50, blank=True)

    subject = models.CharField(max_length=200)
    message = models.TextField()

    user_agent = models.CharField(max_length=300, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.created_at:%Y-%m-%d} {self.name} — {self.subject[:50]}"
