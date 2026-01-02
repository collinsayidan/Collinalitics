from django.contrib import admin
from .models import Thread, Message
from .models import KnowledgeDocument, KnowledgeEmbedding


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


# ✅ Move this ABOVE KnowledgeDocumentAdmin
class KnowledgeEmbeddingInline(admin.TabularInline):
    model = KnowledgeEmbedding
    extra = 0
    fields = ("created_at",)
    readonly_fields = ("created_at",)


@admin.register(KnowledgeDocument)
class KnowledgeDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "created_at")
    search_fields = ("title", "content", "tags")
    inlines = [KnowledgeEmbeddingInline]


@admin.register(KnowledgeEmbedding)
class KnowledgeEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("document", "created_at")
    search_fields = ("document__title",)
