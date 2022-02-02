from email import message
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Measurement
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.conf import settings
import os
import json
from django.http import HttpResponse, Http404
import mimetypes


@csrf_exempt
def upload_file(request, file_name):
    title = file_name.split(".")[0]
    if request.method == "POST":
        if Measurement.objects.filter(title=title).exists():
            print("obstaja")
        else:
            instance = Measurement(title=title, json_file = request.FILES["file1"], npz_file =request.FILES["file2"])
            instance.save()
    return HttpResponse(status=201)

@login_required
def measurements(request):
    measurements = Measurement.objects.all()
    files_list = list(Measurement.objects.values_list("json_file"))
    return render(request, 'measurements/measurements.html', {'measurements':measurements, "section":"measurements", "files":files_list})


def ajax_get_view(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, "measurements", file_name)
    print(file_path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            json_obj = json.load(fh)
            return JsonResponse(json_obj)

@login_required
def download_file(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT,"measurements", path)
    print(file_path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            mime_type, _ = mimetypes.guess_type(file_path)
            print(mime_type)
            response = HttpResponse(fh.read(), content_type=mime_type)
            response['Content-Disposition'] = "attachment; filename=" + os.path.basename(file_path)
            return response
    raise Http404

@login_required
def delete_measurement(request, measurement):
    measurement.replace(" ","_")
    object = Measurement.objects.get(title=measurement)
    object.delete()
    return redirect("measurements")
