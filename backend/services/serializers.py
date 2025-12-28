
from rest_framework import serializers
from .models import ServiceCategory, Service, ServiceFeature, ServiceProject

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
        """
        Return ordered case studies via the through model (ServiceProject),
        not via obj.projects, which no longer exists.
        """
        items = []
        qs = ServiceProject.objects.filter(service=obj)\
                                   .select_related('project')\
                                   .order_by('order', 'id')
        for link in qs:
            p = link.project
            items.append({
                'id': p.id,
                'slug': getattr(p, 'slug', None),
                'title': getattr(p, 'title', str(p)),
                'thumbnail_url': getattr(p, 'thumbnail_url', None),
                'order': link.order,
            })
        return items


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ('id', 'name', 'slug', 'description', 'services')
