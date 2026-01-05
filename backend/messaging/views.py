from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Conversation, Message
from django.contrib.auth.models import User

@login_required
def inbox(request):
    conversations = Conversation.objects.filter(
        client=request.user
    ) | Conversation.objects.filter(
        consultant=request.user
    )

    return render(request, "messaging/inbox.html", {
        "conversations": conversations
    })

@login_required
def conversation_view(request, pk):
    conversation = get_object_or_404(Conversation, pk=pk)

    # Ensure user is part of the conversation
    if request.user not in [conversation.client, conversation.consultant]:
        return redirect("inbox")

    messages = Message.objects.filter(conversation=conversation)

    if request.method == "POST":
        content = request.POST.get("content")
        if content.strip():
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
        return redirect(f"/messaging/{pk}/")

    return render(request, "messaging/conversation.html", {
        "conversation": conversation,
        "messages": messages
    })
