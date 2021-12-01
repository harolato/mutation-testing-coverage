# Create your views here.
from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.authentication import SimpleTokenAuth
from api.serializers import JobSerializer, BasicFileSerializer, \
    ListProjectSerializer, DetailProjectSerializer, BasicJobSerializer, FileSerializer, MutationSerializer
from job.models import Job, File, Mutation, Project


class JobViewSet(viewsets.ModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def retrieve(self, request, *args, **kwargs):
        job = self.get_object()
        return Response(BasicJobSerializer(instance=job).data)


class FileViewSet(viewsets.ModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]

    http_method_names = ['get']
    queryset = File.objects.all()
    serializer_class = FileSerializer


class MutationViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Mutation.objects.all()
    serializer_class = MutationSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]

    http_method_names = ['get']
    serializer_class = ListProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        user: User = self.request.user
        if user.id:
            return Project.objects.filter(user=user)
        return None

    def retrieve(self, request, *args, **kwargs):
        project = self.get_object()
        return Response(DetailProjectSerializer(instance=project).data)
