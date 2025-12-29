
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'client_name', 'industry', 'status')
    search_fields = ('title', 'slug', 'client_name', 'industry', 'summary', 'tools', 'tags')
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        ('Basics', {
            'fields': ('title', 'slug', 'summary', 'status')
        }),
        ('Client & Context', {
            'fields': ('client_name', 'industry', 'location', 'start_date', 'end_date')
        }),
        ('Visuals', {
            'fields': ('thumbnail_url', 'hero_image_url', 'gallery_urls')
        }),
        ('Narrative', {
            'fields': ('goals', 'approach', 'outcomes', 'metrics')
        }),
        ('Tech & Taxonomy', {
            'fields': ('tools', 'tags')
        }),
    )
