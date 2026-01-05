from django.core.management.base import BaseCommand
from support.models import KnowledgeEmbedding

class Command(BaseCommand):
    help = "Backfill the content field for KnowledgeEmbedding rows"

    def handle(self, *args, **kwargs):
        embeddings = KnowledgeEmbedding.objects.all()
        count = embeddings.count()

        self.stdout.write(f"Found {count} embeddings. Backfilling...")

        updated = 0
        for emb in embeddings:
            if not emb.content:
                # Adjust this if your KnowledgeDocument uses a different field name
                emb.content = emb.document.text  
                emb.save()
                updated += 1

        self.stdout.write(self.style.SUCCESS(f"Backfilled {updated} embeddings."))
