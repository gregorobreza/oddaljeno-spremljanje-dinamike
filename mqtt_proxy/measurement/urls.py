from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('upload/<str:file_name>/', views.upload_file, name='upload'),
    path('', views.measurements, name='measurements'),
    path('download/measurements/<str:file_name>/', views.ajax_get_view, name='download'),
    path('download_file/<str:path>/', views.download_file, name='download_file'),
    path('delete/<str:measurement>', views.delete_measurement, name="delete")

]