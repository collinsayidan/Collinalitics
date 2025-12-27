
from rest_framework import serializers
from .models import ServiceCategory, Service, ServiceFeature

class ServiceFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = ('id', 'label')

class ServiceSerializer(serializers.ModelSerializer):
    features = ServiceFeatureSerializer(many=True, read_only=True)
    category = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    projects = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            'id', 'title', 'slug', 'excerpt', 'description', 'category',
            'icon', 'is_active', 'order', 'features', 'projects'
        )

    def get_projects(self, obj):
        items = []
        for p in obj.projects.all():
            items.append({
                'id': p.id,
                'slug': getattr(p, 'slug', None),
                'title': getattr(p, 'title', str(p)),
                'thumbnail_url': getattr(p, 'thumbnail_url', None)
            })
        return items

class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ('id', 'name', 'slug', 'description', 'services')
