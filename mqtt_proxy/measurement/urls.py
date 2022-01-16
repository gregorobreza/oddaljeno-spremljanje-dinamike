from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('upload/<str:file_name>/', views.upload_file, name='upload'),
]