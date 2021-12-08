# Create your views here.
from django.contrib.auth.models import User
from github import Github
from github.GithubException import BadCredentialsException

from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import SimpleTokenAuth
from api.serializers import JobSerializer, BasicFileSerializer, \
    ListProjectSerializer, DetailProjectSerializer, BasicJobSerializer, FileSerializer, MutationSerializer, \
    UserSerializer, ProfileSerializer, ProfileUpdateSerializer
from job.models import Job, File, Mutation, Project, Profile


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


class UserViewSet(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        user: User = self.request.user
        if user.id:
            return Response(UserSerializer(user, many=False).data)
        return None


class ProfileViewSet(APIView):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put']

    def get(self, request, *args, **kwargs):
        user: User = self.request.user
        if user.id:
            profile = Profile.objects.get(user_id=user.id)
            return Response(ProfileSerializer(profile, many=False).data)
        return None

    def put(self, request, *args, **kwargs):
        request.data['access_token'] = str(request.data['access_token'])

        if len(request.data['access_token']) > 0:
            try:
                gh = Github(login_or_token=request.data['access_token']).get_user().login
            except BadCredentialsException:
                return Response(data={'error': 'Invalid Github Access Token'}, status=401)
        user: User = self.request.user
        if user.id:
            profile = Profile.objects.get(user_id=user.id)
            serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(ProfileSerializer(serializer.instance, many=False).data)
        return None


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]

    http_method_names = ['get']
    serializer_class = ListProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        user: User = self.request.user
        if user.id:
            return Project.objects.filter(projectmembership__user=user)
        return None

    def retrieve(self, request, *args, **kwargs):
        project = self.get_object()
        return Response(DetailProjectSerializer(instance=project, context={'request': self.request}).data)
