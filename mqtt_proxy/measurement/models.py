from django.db import models

# Create your models here.

class Measurement(models.Model):
    file = models.FileField(upload_to="measurements/")