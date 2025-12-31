
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "date", "author", "reading_time")
    search_fields = ("title", "slug", "excerpt", "content", "content_html")
    list_filter = ("date", "author")
    prepopulated_fields = {"slug": ("title",)}
