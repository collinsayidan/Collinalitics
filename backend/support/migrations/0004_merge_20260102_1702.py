from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ("support", "0003_enable_pgvector"),
        ("support", "0002_knowledgedocument_knowledgeembedding"),
    ]

    operations = []