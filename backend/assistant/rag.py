from support.models import KnowledgeEmbedding
from django.db.models import F
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed_text(text):
    response = client.embeddings.create(
        model="text-embedding-3-large",
        input=text
    )
    return response.data[0].embedding

def search_similar(query, limit=3):
    query_vector = embed_text(query)

    embeddings = KnowledgeEmbedding.objects.all()

    scored = []
    for emb in embeddings:
        score = np.dot(query_vector, emb.embedding)
        scored.append((score, emb))

    scored.sort(reverse=True, key=lambda x: x[0])
    return [emb for _, emb in scored[:limit]]

def generate_answer(query):
    context_embeddings = search_similar(query)
    context = "\n\n".join([e.content for e in context_embeddings])

    prompt = f"""
    You are Collinalitics AI Assistant.
    Use ONLY the context below to answer the question.

    CONTEXT:
    {context}

    QUESTION:
    {query}

    ANSWER:
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message["content"]
