# Create your views here.
from django.db.models import Q
from rest_framework import viewsets, request
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from api.authentication import SimpleTokenAuth, SimpleTokenAuthIsAuthenticated
from api.serializers import JobSerializer, FileSerializer, MutationSerializer, ProjectSerializer
from job.models import Job, File, Mutation, Project


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


class ProjectViewSet(viewsets.ModelViewSet):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(user=user)
