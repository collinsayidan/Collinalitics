from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .rag import generate_answer

@login_required
def assistant_view(request):
    answer = None

    if request.method == "POST":
        question = request.POST.get("question")
        answer = generate_answer(question)

    return render(request, "assistant/home.html", {"answer": answer})
