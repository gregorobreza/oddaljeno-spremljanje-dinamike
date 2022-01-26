from django.db import models
from django.utils import timezone
# Create your models here.

class Measurement(models.Model):
    title = models.CharField(max_length=250)
    json_file = models.FileField(upload_to="measurements/")
    npz_file = models.FileField(upload_to="measurements/")
    comment = models.CharField(max_length=50)
    added = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ("-added",)

    def __str__(self):
        return self.title