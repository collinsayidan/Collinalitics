# services/models.py

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.text import slugify


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Service Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)

    excerpt = models.TextField(blank=True)
    description = models.TextField(blank=True)
    description_html = models.TextField(blank=True)

    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="FontAwesome class, e.g. 'fa-solid fa-chart-line'"
    )

    # Pricing
    price_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_currency = models.CharField(max_length=10, default="GBP")
    price_unit = models.CharField(max_length=50, blank=True, help_text="hour, project, month, etc.")

    # Category
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="services"
    )

    # Lists
    features_list = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list
    )

    tools_list = ArrayField(
        models.CharField(max_length=255),
        blank=True,
        default=list
    )

    # Related portfolio projects
    related_projects = models.ManyToManyField(
        "portfolio.Project",
        blank=True,
        related_name="services"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
