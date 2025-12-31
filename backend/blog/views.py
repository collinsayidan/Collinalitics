
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.all().order_by("-date")
    serializer_class = PostSerializer
    lookup_field = "slug"  # enables /api/blog/posts/<slug>/
