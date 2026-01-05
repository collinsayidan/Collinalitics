from django.contrib import admin
from .models import TrainingModule, TrainingProgress


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "level")
    list_filter = ("level",)


@admin.register(TrainingProgress)
class TrainingProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "module", "completed")
    list_filter = ("completed", "module")
