from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('upload/', views.upload_file, name='upload'),
]