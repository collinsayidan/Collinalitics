
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    summary = models.TextField(blank=True)
    thumbnail_url = models.URLField(blank=True)

    def __str__(self):
        return self.title
