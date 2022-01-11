from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Device
# Create your views here.


@login_required
def dashboard(request):
    devices = Device.objects.all()
    return render(request, 'account/dashboard.html', {'devices':devices, 'section': 'dashboard'})


