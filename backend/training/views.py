from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import TrainingModule, TrainingProgress
from .models import TrainingModule, TrainingProgress, Quiz, Question, Answer



@login_required
def training_list(request):
    modules = TrainingModule.objects.all()

    progress = TrainingProgress.objects.filter(user=request.user)
    progress_map = {p.module_id: p.completed for p in progress}

    beginner = modules.filter(level="beginner")
    intermediate = modules.filter(level="intermediate")
    advanced = modules.filter(level="advanced")

    # Recommended module logic
    completed_ids = progress.filter(completed=True).values_list("module_id", flat=True)
    recommended = modules.exclude(id__in=completed_ids).order_by("level").first()

    total_modules = modules.count()
    completed_modules = progress.filter(completed=True).count()
    progress_percentage = int((completed_modules / total_modules) * 100) if total_modules > 0 else 0

    return render(request, "training/list.html", {
        "beginner": beginner,
        "intermediate": intermediate,
        "advanced": advanced,
        "progress_map": progress_map,
        "recommended": recommended,
        "total_modules": total_modules,
        "completed_modules": completed_modules,
        "progress_percentage": progress_percentage,
    })


@login_required
def training_detail(request, pk):
    module = get_object_or_404(TrainingModule, pk=pk)

    progress, created = TrainingProgress.objects.get_or_create(
        user=request.user,
        module=module
    )

    if request.method == "POST":
        progress.completed = True
        progress.save()

    return render(request, "training/detail.html", {
        "module": module,
        "progress": progress
    })


@login_required
def certificate_view(request):
    total = TrainingModule.objects.count()
    completed = TrainingProgress.objects.filter(
        user=request.user, completed=True
    ).count()

    if completed < total:
        return redirect("training")  # Not eligible yet

    return render(request, "training/certificate.html")

@login_required
def training_analytics(request):
    total = TrainingModule.objects.count()
    completed = TrainingProgress.objects.filter(
        user=request.user, completed=True
    ).count()

    beginner = TrainingProgress.objects.filter(
        user=request.user, module__level="beginner", completed=True
    ).count()

    intermediate = TrainingProgress.objects.filter(
        user=request.user, module__level="intermediate", completed=True
    ).count()

    advanced = TrainingProgress.objects.filter(
        user=request.user, module__level="advanced", completed=True
    ).count()

    return render(request, "training/analytics.html", {
        "total": total,
        "completed": completed,
        "beginner": beginner,
        "intermediate": intermediate,
        "advanced": advanced,
    })

@login_required
def quiz_view(request, pk):
    quiz = get_object_or_404(Quiz, module_id=pk)
    questions = quiz.question_set.all()

    if request.method == "POST":
        score = 0
        for q in questions:
            selected = request.POST.get(str(q.id))
            if selected:
                answer = Answer.objects.get(id=selected)
                if answer.is_correct:
                    score += 1

        return render(request, "training/quiz_result.html", {
            "quiz": quiz,
            "score": score,
            "total": questions.count()
        })

    return render(request, "training/quiz.html", {
        "quiz": quiz,
        "questions": questions
    })


