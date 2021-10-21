# Create your views here.
from rest_framework import viewsets

from api.serializers import JobSerializer, FileSerializer, MutationSerializer
from job.models import Job, File, Mutation


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer


class MutationViewSet(viewsets.ModelViewSet):
    queryset = Mutation.objects.all()
    serializer_class = MutationSerializer
