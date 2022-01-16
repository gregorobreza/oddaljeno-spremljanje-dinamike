# chat/views.py
from django.shortcuts import render
from account.models import Device

def index(request):
    return render(request, 'mqtt_stream/index.html', {})

def room(request, room_name):
    device = Device.objects.filter(address=room_name)[0]
    return render(request, 'mqtt_stream/room.html', {"device":device,
        'room_name': room_name
    })
