from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ("support", "0001_initial"),  # MUST be before vector usage
    ]

    operations = [
        migrations.RunSQL(
            sql="CREATE EXTENSION IF NOT EXISTS vector;",
            reverse_sql="DROP EXTENSION IF EXISTS vector;",
        ),
    ]