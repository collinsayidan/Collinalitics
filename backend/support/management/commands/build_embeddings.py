from django.core.management.base import BaseCommand
from support.models import KnowledgeDocument, KnowledgeEmbedding
from openai import OpenAI

class Command(BaseCommand):
    help = "Build embeddings for all KnowledgeDocuments"

    def handle(self, *args, **options):
        client = OpenAI()

        # Clear old embeddings
        KnowledgeEmbedding.objects.all().delete()

        docs = KnowledgeDocument.objects.all()

        if not docs.exists():
            self.stdout.write(self.style.WARNING("No KnowledgeDocument records found"))
            return

        for doc in docs:
            self.stdout.write(f"Embedding: {doc.title}")

            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=doc.content,
            )

            vector = response.data[0].embedding

            KnowledgeEmbedding.objects.create(
                document=doc,
                embedding=vector,
            )

        self.stdout.write(self.style.SUCCESS("Embeddings built successfully"))
