
from django.contrib import admin
from .models import ServiceCategory, Service, ServiceFeature

class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ServiceFeatureInline]
    ordering = ('order',)
    filter_horizontal = ('projects',)

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}
