from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="client_conversations")
    consultant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultant_conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.username} ↔ {self.consultant.username}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Message from {self.sender.username}"
