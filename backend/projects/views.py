from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import Project


@login_required
def project_list(request):
    # Only show projects belonging to the logged-in client
    projects = Project.objects.filter(client=request.user)

    # Search
    q = request.GET.get("q")
    if q:
        projects = projects.filter(title__icontains=q)

    # Filter by status
    status = request.GET.get("status")
    if status:
        projects = projects.filter(status=status)

    # Pagination
    paginator = Paginator(projects, 6)  # 6 per page
    page = request.GET.get("page")
    projects = paginator.get_page(page)

    return render(request, "projects/list.html", {"projects": projects})


@login_required
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk, client=request.user)
    return render(request, "projects/detail.html", {"project": project})
