from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Measurement
# Create your views here.

@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        instance = Measurement(file = request.FILES["test.txt"])
        instance.save()

        

    return HttpResponse(status=201)