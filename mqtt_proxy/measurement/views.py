from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Measurement
from django.contrib.auth.decorators import login_required
# Create your views here.

@csrf_exempt
def upload_file(request, file_name):
    title = file_name.split(".")[0]
    if request.method == "POST":
        instance = Measurement(title=title, json_file = request.FILES["file1"], npz_file =request.FILES["file2"])
        instance.save()

    return HttpResponse(status=201)

@login_required
def measurements(request):
    measurements = Measurement.objects.all()
    return render(request, 'measurements/measurements.html', {'measurements':measurements, "section":"measurements"})