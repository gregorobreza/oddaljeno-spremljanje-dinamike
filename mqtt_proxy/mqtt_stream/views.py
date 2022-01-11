# chat/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'mqtt_stream/index.html', {})

def room(request, room_name):
    return render(request, 'mqtt_stream/room.html', {
        'room_name': room_name
    })
