from django.contrib.auth.models import User
from github import Github
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from job.models import Project


class GHRepoViewSet(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAuthenticated]

    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        user: User = self.request.user
        if len(user.user_profile.access_token) <= 0:
            return []

        g = Github(user.user_profile.access_token)
        g_user = g.get_user()
        data = []
        for repo in g_user.get_repos():
            project_exists = Project.objects.filter(git_repo_name=repo.name, git_repo_owner=repo.owner.login).exists()
            data.append({
                'id': repo.id,
                'url': repo.url,
                'owner': repo.owner.login,
                'name': repo.name,
                'full_name': repo.full_name,
                'exists': project_exists
            })
        return Response(data)


class GHUserViewSet(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        user: User = self.request.user
        if len(user.user_profile.access_token) <= 0:
            return []

        g = Github(user.user_profile.access_token)
        g_user = g.get_user()
        return Response(g_user.raw_data)
