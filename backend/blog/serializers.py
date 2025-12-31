
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "content_html",
            "date",
            "author",
            "tags_list",
            "hero_image_url",
            "cover_image_url",
            "reading_time",
        ]
