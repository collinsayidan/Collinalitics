from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import Report


@login_required
def report_list(request):
    # Only show reports belonging to the logged-in client
    reports = Report.objects.filter(client=request.user)

    # Search by title
    q = request.GET.get("q")
    if q:
        reports = reports.filter(title__icontains=q)

    # Filter by status
    status = request.GET.get("status")
    if status:
        reports = reports.filter(status=status)

    # Pagination (6 per page)
    paginator = Paginator(reports, 6)
    page = request.GET.get("page")
    reports = paginator.get_page(page)

    return render(request, "reports/list.html", {"reports": reports})


@login_required
def report_detail(request, pk):
    report = get_object_or_404(Report, pk=pk, client=request.user)
    return render(request, "reports/detail.html", {"report": report})
