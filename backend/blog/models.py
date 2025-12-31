
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True)        # plain text fallback
    content_html = models.TextField(blank=True)   # preferred rendered HTML
    date = models.DateField(auto_now_add=True)
    author = models.CharField(max_length=120, blank=True)
    tags_list = models.JSONField(default=list, blank=True)
    hero_image_url = models.URLField(blank=True)
    cover_image_url = models.URLField(blank=True)
    reading_time = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.title
