from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=50, default="In Progress")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
