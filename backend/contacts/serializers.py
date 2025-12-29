
from rest_framework import serializers
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = (
            'id', 'created_at',
            'name', 'email', 'company', 'phone',
            'subject', 'message'
        )
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        # minimal sanity validation (you can expand)
        if not attrs.get('name'):
            raise serializers.ValidationError({'name': 'Name is required.'})
        if not attrs.get('email'):
            raise serializers.ValidationError({'email': 'Email is required.'})
        if not attrs.get('subject'):
            raise serializers.ValidationError({'subject': 'Subject is required.'})
        if not attrs.get('message'):
            raise serializers.ValidationError({'message': 'Message is required.'})
        return attrs
