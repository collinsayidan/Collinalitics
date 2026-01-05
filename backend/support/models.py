from django.db import models
from pgvector.django import VectorField


class Thread(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("waiting", "Waiting for user"),
        ("closed", "Closed"),
    ]

    email = models.EmailField(blank=True, null=True)
    subject = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="open"
    )

    def __str__(self):
        return f"{self.subject} ({self.status})"


class Message(models.Model):
    SENDER_CHOICES = [
        ("user", "User"),
        ("bot", "Bot"),
        ("agent", "Agent"),
    ]

    thread = models.ForeignKey(
        Thread, related_name="messages", on_delete=models.CASCADE
    )
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"[{self.sender}] {self.text[:40]}"


class KnowledgeDocument(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    tags = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class KnowledgeEmbedding(models.Model):
    document = models.ForeignKey(
        KnowledgeDocument,
        on_delete=models.CASCADE,
        related_name="embeddings"
    )
    content = models.TextField(null=True, blank=True) # chunk text
    embedding = VectorField()  # correct argument name
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding for {self.document.title}"
