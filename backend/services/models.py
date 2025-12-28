
# backend/services/models.py
from django.db import models

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name


class Service(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True)
    excerpt = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, related_name='services')
    icon = models.CharField(max_length=64, blank=True, help_text="Optional icon name (e.g. 'fa-chart-line')")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    # NOTE: We DO NOT declare a ManyToMany 'projects' field here.
    # Case studies are managed via the ordered through model 'ServiceProject'.

    def __str__(self):
        return self.title


class ServiceFeature(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='features')
    label = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.service.title} – {self.label}"


class ServiceProject(models.Model):
    """
    Ordered through model connecting Service <-> portfolio.Project
    Enables explicit per-service display order for case studies.
    """
    service = models.ForeignKey('Service', on_delete=models.CASCADE)
    project = models.ForeignKey('portfolio.Project', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('service', 'project')
        ordering = ('order', 'id')

    def __str__(self):
        return f"{self.service} → {self.project} (order {self.order})"
