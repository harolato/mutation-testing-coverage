from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import HttpRequest
from django.shortcuts import render

from testamp.models import TestSuite


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


def error_view(request: HttpRequest):
    division_by_zero = 1 / 0
