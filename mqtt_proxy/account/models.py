from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Device(models.Model):
    title = models.CharField(max_length=250)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="devices")
    added = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=300)
    comments = models.TextField(max_length=250)
    
    class Meta:
        ordering = ("-added",)

    def __str__(self):
        return self.title



