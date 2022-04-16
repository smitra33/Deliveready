import django
from django.urls import path, include
from django.contrib.auth.views import auth_login, auth_logout
from . import views

urlpatterns = [
    path('register/', views.register, name='register')
]