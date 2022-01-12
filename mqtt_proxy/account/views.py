from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Device
from .forms import UserEditForm
# Create your views here.


@login_required
def dashboard(request):
    devices = Device.objects.all()
    device_list = list(Device.objects.values_list("address"))
    return render(request, 'account/dashboard.html', {'devices':devices,'device_list':device_list, 'section': 'devices'})


@login_required
def edit(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user, data=request.POST)

        if user_form.is_valid():
            user_form.save()
    else:
        user_form = UserEditForm(instance=request.user)

    return render(request, 'account/edit.html', {'user_form': user_form, "section":"profile"})