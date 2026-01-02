from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from django.conf import settings
from openai import OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)

from .utils.retrieval import search_knowledge_base
from .models import Thread, Message
from .serializers import ThreadSerializer
from .rag import generate_bot_reply



class StartThreadView(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip() or None
        subject = request.data.get("subject", "Support request").strip()

        thread = Thread.objects.create(email=email, subject=subject)

        return Response({"thread_id": thread.id}, status=status.HTTP_201_CREATED)


class ThreadDetailView(APIView):
    def get(self, request, thread_id):
        thread = get_object_or_404(Thread, id=thread_id)
        serializer = ThreadSerializer(thread)
        return Response(serializer.data)


class SendMessageView(APIView):
    def post(self, request, thread_id):
        thread = get_object_or_404(Thread, id=thread_id)
        text = request.data.get("text", "").strip()

        if not text:
            return Response(
                {"detail": "Text is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save user message
        Message.objects.create(
            thread=thread,
            sender="user",
            text=text,
        )

        # Call RAG pipeline for bot reply (can be async later)
        bot_reply = generate_bot_reply(thread=thread, user_message=text)

        if bot_reply:
            Message.objects.create(
                thread=thread,
                sender="bot",
                text=bot_reply,
            )

        thread.status = "open"
        thread.save(update_fields=["status"])

        serializer = ThreadSerializer(thread)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AskView(APIView):
    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response({"error": "Question is required"}, status=400)

        results = search_knowledge_base(question)

        context_text = "\n\n".join(
            f"- {r['document'].title}: {r['document'].content}"
            for r in results
        )

        prompt = f"""
You are a helpful assistant. Use the context below to answer the question.

Context:
{context_text}

Question: {question}

Answer:
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        answer = response.choices[0].message["content"]

        return Response({
            "answer": answer,
            "sources": [r["document"].title for r in results]
        })
