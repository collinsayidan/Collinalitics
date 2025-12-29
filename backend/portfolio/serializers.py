
# backend/portfolio/serializers.py
from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    # Derived fields for frontend convenience
    tools_list = serializers.SerializerMethodField()
    tags_list = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'summary',
            'thumbnail_url', 'hero_image_url',
            'client_name', 'industry', 'location',
            'start_date', 'end_date', 'status',
            'goals', 'approach', 'outcomes', 'metrics',
            'tools', 'tags',
            'tools_list', 'tags_list', 'gallery',
        )

    # ---------- helpers ----------
    def _split_csv(self, text: str) -> list[str]:
        """
        Split a comma-separated string into a trimmed list.
        """
        if not text:
            return []
        return [s.strip() for s in text.split(',') if s.strip()]

    def _clean_line(self, s: str) -> str:
        """
        Remove common leading bullet markers and extra whitespace.
        Examples:
        " - SQL Modelling " -> "SQL Modelling"
        "• Power BI"        -> "Power BI"
        """
        if not s:
            return ''
        return s.strip().lstrip('-•').strip()

    # ---------- derived fields ----------
    def get_tools_list(self, obj) -> list[str]:
        raw = self._split_csv(obj.tools)
        return [self._clean_line(x) for x in raw if x]

    def get_tags_list(self, obj) -> list[str]:
        raw = self._split_csv(obj.tags)
        return [self._clean_line(x) for x in raw if x]

    def get_gallery(self, obj) -> list[str]:
        """
        One URL per line in gallery_urls -> list[str]
        """
        if not obj.gallery_urls:
            return []
        urls = [s.strip() for s in obj.gallery_urls.splitlines() if s.strip()]
        return urls
