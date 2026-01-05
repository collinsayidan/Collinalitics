# services/serializers.py

from rest_framework import serializers
from .models import Service, ServiceCategory
from portfolio.serializers import ProjectSerializer


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ("id", "name", "slug")


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    related_projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "description",
            "description_html",
            "icon",

            # Pricing
            "price_min",
            "price_max",
            "price_currency",
            "price_unit",

            # Category
            "category",

            # Lists
            "features_list",
            "tools_list",

            # Related case studies
            "related_projects",

            # Timestamps
            "created_at",
            "updated_at",
        )
