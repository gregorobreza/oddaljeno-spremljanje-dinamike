from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Device
import json
# Create your views here.


@login_required
def dashboard(request):
    devices = Device.objects.all()
    device_list = list(Device.objects.values_list("address"))
    return render(request, 'account/dashboard.html', {'devices':devices,'device_list':device_list, 'section': 'dashboard'})


