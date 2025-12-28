
# backend/services/admin.py
from django.contrib import admin
from .models import ServiceCategory, Service, ServiceFeature, ServiceProject

class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1

class ServiceProjectInline(admin.TabularInline):
    """
    Inline to manage per-service case studies ordering.
    """
    model = ServiceProject
    extra = 0
    fields = ('project', 'order')
    ordering = ('order',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ServiceFeatureInline, ServiceProjectInline]
    ordering = ('order',)

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}
