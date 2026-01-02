import os
from django.db import connection
from openai import OpenAI
from support.models import KnowledgeEmbedding, KnowledgeDocument
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def embed_text(text: str):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


def search_knowledge_base(query: str, limit: int = 3):
    query_embedding = embed_text(query)

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, document_id, 1 - (embedding <=> %s) AS similarity
            FROM support_knowledgeembedding
            ORDER BY embedding <=> %s
            LIMIT %s;
        """, [query_embedding, query_embedding, limit])

        rows = cursor.fetchall()

    results = []
    for embedding_id, doc_id, similarity in rows:
        doc = KnowledgeDocument.objects.get(id=doc_id)
        results.append({
            "document": doc,
            "similarity": float(similarity),
        })

    return results
