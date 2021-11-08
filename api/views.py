# Create your views here.
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from api.authentication import SimpleTokenAuth, SimpleTokenAuthIsAuthenticated
from api.serializers import JobSerializer, FileSerializer, MutationSerializer
from job.models import Job, File, Mutation


class JobViewSet(viewsets.ModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class FileViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = File.objects.all()
    serializer_class = FileSerializer


class MutationViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Mutation.objects.all()
    serializer_class = MutationSerializer
