from django.contrib import admin
from .models import Measurement
# Register your models here.

@admin.register(Measurement)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ("title", "json_file", "npz_file", "added")