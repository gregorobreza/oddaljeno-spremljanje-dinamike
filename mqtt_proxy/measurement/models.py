from django.db import models
from django.utils import timezone
from django.dispatch import receiver

import os
import uuid
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

@receiver(models.signals.post_delete, sender=Measurement)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.npz_file and instance.json_file:
        if os.path.isfile(instance.npz_file.path) and os.path.isfile(instance.json_file.path):
            os.remove(instance.npz_file.path)
            os.remove(instance.json_file.path)