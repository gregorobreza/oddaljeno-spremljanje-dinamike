from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from models import Measurement
import os

@receiver(post_delete, sender=Measurement)
def post_save_image(sender, instance, *args, **kwargs):
    """ Clean Old Image file """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)