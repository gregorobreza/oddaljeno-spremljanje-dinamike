from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Measurement
# Create your views here.

@csrf_exempt
def upload_file(request, file_name):
    title = file_name.split(".")[0]
    if request.method == "POST":
        instance = Measurement(title=title, file = request.FILES[file_name])
        instance.save()

    return HttpResponse(status=201)