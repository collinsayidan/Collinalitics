from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.template.loader import get_template

from .models import TrainingModule, TrainingProgress, Quiz, Question, Answer
from .utils import generate_qr_code

# PDF generator
from xhtml2pdf import pisa
import datetime


@login_required
def training_list(request):
    modules = TrainingModule.objects.all()

    # -----------------------------
    # USER PROGRESS
    # -----------------------------
    progress_qs = TrainingProgress.objects.filter(user=request.user)
    progress_map = {p.module_id: p.completed for p in progress_qs}

    # -----------------------------
    # MODULE LEVELS
    # -----------------------------
    beginner = modules.filter(level="beginner")
    intermediate = modules.filter(level="intermediate")
    advanced = modules.filter(level="advanced")

    # -----------------------------
    # RECOMMENDED MODULE
    # -----------------------------
    completed_ids = progress_qs.filter(completed=True).values_list("module_id", flat=True)
    recommended = (
        modules.exclude(id__in=completed_ids)
        .order_by("level", "id")
        .first()
    )

    # -----------------------------
    # PROGRESS PERCENTAGE (SAFE)
    # -----------------------------
    total_modules = modules.count()
    completed_modules = progress_qs.filter(completed=True).count()

    if total_modules > 0:
        progress_percentage = int((completed_modules / total_modules) * 100)
    else:
        progress_percentage = 0

    # Clamp between 0 and 100
    progress_percentage = max(0, min(progress_percentage, 100))

    # -----------------------------
    # OPTIONAL SEARCH
    # -----------------------------
    q = request.GET.get("q")
    if q:
        modules = modules.filter(title__icontains=q)

    # -----------------------------
    # PAGINATION
    # -----------------------------
    paginator = Paginator(modules, 6)
    page_number = request.GET.get("page")
    modules_page = paginator.get_page(page_number)

    return render(request, "training/list.html", {
        "modules": modules_page,
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

    progress, _ = TrainingProgress.objects.get_or_create(
        user=request.user,
        module=module
    )

    if request.method == "POST":
        progress.completed = True
        progress.save()

    return render(request, "training/detail.html", {
        "module": module,
        "progress": progress,
    })


@login_required
def certificate_view(request):
    total = TrainingModule.objects.count()
    completed = TrainingProgress.objects.filter(
        user=request.user, completed=True
    ).count()

    if completed < total:
        return redirect("training_dashboard")

    progress = TrainingProgress.objects.filter(
        user=request.user, completed=True
    ).first()

    certificate_id = progress.certificate_id
    verify_url = f"https://collinalitics.com/certificates/{certificate_id}/"
    qr_code = generate_qr_code(verify_url)

    return render(request, "training/certificate.html", {
        "certificate_id": certificate_id,
        "qr_code": qr_code,
        "verify_url": verify_url,
    })


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
            "total": questions.count(),
        })

    return render(request, "training/quiz.html", {
        "quiz": quiz,
        "questions": questions,
    })


# ---------------------------------------------------------
# PDF CERTIFICATE
# ---------------------------------------------------------
@login_required
def certificate_pdf(request):
    progress = TrainingProgress.objects.filter(
        user=request.user, completed=True
    ).first()

    certificate_id = progress.certificate_id
    verify_url = f"https://collinalitics.com/certificates/{certificate_id}/"
    qr_code = generate_qr_code(verify_url)

    template = get_template("training/certificate_pdf.html")

    context = {
        "certificate_id": certificate_id,
        "qr_code": qr_code,
        "verify_url": verify_url,
        "user": request.user,
        "date": datetime.date.today(),
    }

    html = template.render(context)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="certificate.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)

    if pisa_status.err:
        return HttpResponse("Error generating PDF", status=500)

    return response
