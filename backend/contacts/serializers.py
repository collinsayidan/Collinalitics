
# backend/contacts/serializers.py
from rest_framework import serializers
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    hp_field = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Inquiry
        fields = (
            'id', 'created_at',
            'name', 'email', 'company', 'phone',
            'subject', 'message',
            'hp_field',  # honeypot (write-only)
        )
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        # Honeypot check
        if (attrs.get('hp_field') or '').strip():
            raise serializers.ValidationError({'detail': 'Spam detected.'})

        # Required fields
        if not (attrs.get('name') or '').strip():
            raise serializers.ValidationError({'name': 'Name is required.'})
        if not (attrs.get('email') or '').strip():
            raise serializers.ValidationError({'email': 'Email is required.'})
        if not (attrs.get('subject') or '').strip():
            raise serializers.ValidationError({'subject': 'Subject is required.'})
        if not (attrs.get('message') or '').strip():
            raise serializers.ValidationError({'message': 'Message is required.'})

        return attrs
