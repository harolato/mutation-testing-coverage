import json

from django.shortcuts import render


# Create your views here.
from api.serializers import FileSerializer
from job.models import Mutation, File


def index(request, *args, **kwargs):
    dummy_source = open("dummy.js", "r")
    file = File.objects.get(pk=5)
    return render(request, 'frontend/index.html', {
        'file': dummy_source.read(),
        'mutations': FileSerializer(file).data
    })
