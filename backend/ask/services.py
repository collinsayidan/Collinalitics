from django.db import connection
from support.models import KnowledgeEmbedding
from .models import Question, Answer

def embed(text):
    return [0.0] * 1536

def call_llm(prompt):
    return "This is a placeholder answer. The real LLM will be added soon."

def retrieve_chunks(query, top_k=5):
    embedding = embed(query)

    sql = """
        SELECT id, content, embedding <=> %s AS distance
        FROM support_knowledgeembedding
        ORDER BY embedding <=> %s
        LIMIT %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, [embedding, embedding, top_k])
        rows = cursor.fetchall()

    return rows

def answer_question(question_text):
    q = Question.objects.create(text=question_text)

    chunks = retrieve_chunks(question_text)
    context = "\n\n".join([row[1] for row in chunks])

    prompt = f"Context:\n{context}\n\nQuestion: {question_text}\nAnswer:"
    answer_text = call_llm(prompt)

    Answer.objects.create(question=q, text=answer_text)

    return answer_text
