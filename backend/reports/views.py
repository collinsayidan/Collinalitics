from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Report


@login_required
def report_list(request):
    reports = Report.objects.filter(client=request.user)
    return render(request, "reports/list.html", {"reports": reports})


@login_required
def report_detail(request, pk):
    report = get_object_or_404(Report, pk=pk, client=request.user)
    return render(request, "reports/detail.html", {"report": report})
