
from django.contrib import admin
from .models import Inquiry

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'name', 'email', 'subject', 'company')
    search_fields = ('name', 'email', 'subject', 'message', 'company', 'phone')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)