
from django.db import models

class Project(models.Model):
    # Primary
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    summary = models.TextField(blank=True)

    # Visuals
    thumbnail_url = models.URLField(blank=True)
    hero_image_url = models.URLField(blank=True)

    # Client & context
    client_name = models.CharField(max_length=150, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=120, blank=True)

    # Timeline
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # Status (simple choices)
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')

    # Narrative sections
    goals = models.TextField(blank=True)
    approach = models.TextField(blank=True)
    outcomes = models.TextField(blank=True)
    metrics = models.TextField(blank=True)  # e.g., bullet points or paragraph

    # Tech / taxonomy (comma-separated for simplicity)
    tools = models.CharField(max_length=200, blank=True, help_text="Comma-separated, e.g. 'Power BI, SQL, Python'")
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated, e.g. 'dashboards, automation'")

    # Simple gallery: newline-separated URLs (we'll split in serializer)
    gallery_urls = models.TextField(blank=True, help_text="Enter one image URL per line")

    def __str__(self):
        return self.title
