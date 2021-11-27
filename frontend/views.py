import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render

# Create your views here.
from api.serializers import ProjectSerializer
from job.models import Project


class UserLogin(LoginView):
    template_name = 'frontend/login.html'


@login_required
def index(request, *args, **kwargs):
    dummy_source = open("dummy.js", "r")
    file = Project.objects.all()
    return render(request, 'frontend/index.html')


class UserLogout(LogoutView):
    pass
