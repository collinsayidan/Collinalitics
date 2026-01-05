from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Project

@login_required
def project_list(request):
    projects = Project.objects.filter(client=request.user)
    return render(request, "projects/list.html", {"projects": projects})

@login_required
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk, client=request.user)
    return render(request, "projects/detail.html", {"project": project})
