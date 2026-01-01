from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Thread, Message
from .serializers import ThreadSerializer
from .rag import generate_bot_reply  # we'll create this next

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
