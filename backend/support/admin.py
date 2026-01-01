from django.contrib import admin
from .models import Thread, Message

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ("id", "subject", "email", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("subject", "email")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "thread", "sender", "created_at")
    list_filter = ("sender", "created_at")
    search_fields = ("text",)

from .models import KnowledgeDocument, KnowledgeEmbedding

@admin.register(KnowledgeDocument)
class KnowledgeDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "created_at")
    search_fields = ("title", "content", "tags")


@admin.register(KnowledgeEmbedding)
class KnowledgeEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("document", "created_at")
    search_fields = ("document__title",)
