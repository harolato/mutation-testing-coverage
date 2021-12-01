import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render


class UserLogin(LoginView):
    template_name = 'frontend/login.html'


@login_required
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')


# @todo implement fetching source code from github by providing repo name, user and path to file.
def file_view(request):
    return ''


class UserLogout(LogoutView):
    pass
