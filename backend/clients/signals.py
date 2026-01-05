from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import ClientProfile
from messaging.models import Conversation


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # Create profile
        ClientProfile.objects.create(user=instance)

        # Auto-create conversation with consultant
        try:
            consultant = User.objects.get(username="collins")  # update if needed
            Conversation.objects.create(client=instance, consultant=consultant)
        except User.DoesNotExist:
            pass  # consultant not created yet
