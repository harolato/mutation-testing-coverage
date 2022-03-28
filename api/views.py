# Create your views here.
import json
import os
from difflib import unified_diff
from json import JSONDecodeError

from django.shortcuts import render
from django.template.loader import render_to_string
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from github import Github
from github.GithubException import BadCredentialsException

from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import SimpleTokenAuth
from api.serializers import JobSerializer, \
    ListProjectSerializer, DetailProjectSerializer, BasicJobSerializer, FileSerializer, MutationSerializer, \
    UserSerializer, ProfileSerializer, ProfileUpdateSerializer
from config.utils import json_response_exception, AppException
from job.models import Job, File, Mutation, Project, Profile
from testamp.models import TestSuite, TestCase, TestAmpZipFile


class JobViewSet(viewsets.ModelViewSet):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def create(self, request, *args, **kwargs):
        serializer = JobSerializer(data=request.data, context={'request': self.request})
        if serializer.is_valid():
            try:
                serializer.create(serializer.validated_data)
            except ValueError as error:
                return Response(data={'status': 'error', 'error': str(error)}, status=400)
            return Response({'status': 'OK'}, status=200)
        else:
            return Response(data={'status': 'error', 'error': serializer.errors}, status=400)

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
    http_method_names = ['get', 'patch']
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
                return Response(data={'error': 'Invalid Github Access Token'}, status=400)
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


def create_issue():
    pass


def create_issue_comment():
    pass


class SubmitGHIssueViewSet(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAuthenticated]

    http_method_names = ['get', 'post']

    def get(self, request, *args, **kwargs):
        user = self.request.user
        errors = []
        if user.id is None:
            errors.append('User not found')
        if kwargs['mutant_id'] is None:
            errors.append('Mutation ID missing')
        try:
            mutant = Mutation.objects.get(pk=kwargs['mutant_id'])
        except ObjectDoesNotExist:
            raise AppException('Mutation not found')

        try:
            gh = Github(login_or_token=user.user_profile.access_token)
        except BadCredentialsException:
            raise AppException('Invalid Github Access Token')

        if len(errors) == 0:
            gh_repo = gh.get_repo(f"{mutant.file.job.project.git_repo_owner}/{mutant.file.job.project.git_repo_name}")
            gh_labels_obj = gh_repo.get_labels()
            gh_labels = []
            for label in gh_labels_obj:
                gh_labels.append(label.raw_data)
            file_source_code = mutant.file.get_source_code
            mutated_source_fragment = mutant.get_mutated_source_code(file_source_code)

            diff_string = unified_diff(file_source_code['source'].split('\n'),
                                       mutated_source_fragment['source'].split('\n'), lineterm="", n=10,
                                       fromfile=mutant.file.path, tofile=mutant.file.path)

            mutant_url = request.build_absolute_uri(
                f"/projects/{mutant.file.job.project.id}/jobs/{mutant.file.job.id}/files/{mutant.file.id}/mutant/{mutant.id}/")

            github_link = f"https://github.com/{mutant.file.job.project.git_repo_owner}/{mutant.file.job.project.git_repo_name}/blob/{mutant.file.job.git_commit_sha}/{mutant.file.path}#L{mutant.start_line} "

            markdown = render_to_string('api/github_issue.md', {
                'github_link': github_link,
                'mutant': mutant,
                'mutant_url': mutant_url,
                'diff': "\n".join(diff_string)
            })

            issue_title = f"Resolve mutants on {mutant.file.job.git_commit_sha[0:7]}"

            gh_issue = None
            if mutant.file.job.github_issue_id:
                gh_issue = gh_repo.get_issue(mutant.file.job.github_issue_id)
                gh_issue = {
                    'html_url': gh_issue.html_url,
                    'comments_ur': gh_issue.comments_url,
                    'id': mutant.file.job.github_issue_id
                }
            return Response(
                data={'markdown': markdown, 'issue_title': issue_title, 'labels': gh_labels, 'issue': gh_issue})
        raise AppException(message='Errors', exception_data=errors)

    @json_response_exception()
    def post(self, request, *args, **kwargs):
        user: User = self.request.user
        errors = []
        if "markdown" not in request.data:
            errors.append("Missing markdown field")
        if "assign_myself" not in request.data:
            request.data['assign_myself'] = True

        if "labels" not in request.data:
            request.data['labels'] = []

        if "issue_title" not in request.data:
            request.data['issue_title'] = ""
        try:
            gh = Github(login_or_token=user.user_profile.access_token)
            gh_login = gh.get_user().login
        except BadCredentialsException:
            raise AppException('Invalid Github Access Token')

        if user.id is None:
            errors.append('User not found')

        try:
            mutant = Mutation.objects.get(pk=kwargs['mutant_id'])
        except ObjectDoesNotExist:
            raise AppException('Mutation not found')

        if len(errors) == 0:
            assignee = None
            if request.data['assign_myself']:
                assignee = gh_login

            gh_repo = gh.get_repo(f"{mutant.file.job.project.git_repo_owner}/{mutant.file.job.project.git_repo_name}")
            try:
                if mutant.file.job.github_issue_id:
                    gh_issue = gh_repo.get_issue(mutant.file.job.github_issue_id)
                    gh_issue.create_comment(body=request.data['markdown'])
                else:
                    gh_issue = gh_repo.create_issue(body=request.data['markdown'], title=request.data['issue_title'],
                                                    labels=request.data['labels'], assignee=assignee)
                    job = mutant.file.job
                    job.github_issue_id = gh_issue.number
                    job.save()
            except AssertionError as error:
                raise AppException(message='Failed to create Issue. Try again later: ' + error.__str__())
            return Response(
                data={'issue_url': gh_issue.html_url, 'issue_id': gh_issue.number},
                status=200)
        raise AppException(message='Error', exception_data=errors)


class SubmitTestAmpView(APIView):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @json_response_exception()
    def post(self, request: Request, *args, **kwargs):
        if not request.POST.get('json') or not request.FILES.get('file'):
            raise AppException('Missing Field')

        if os.environ.get("DEBUG_", '0') == '1':
            file: InMemoryUploadedFile = request.FILES.get('file')
            TestAmpZipFile.objects.create(
                file=file
            )
            from django.core.files.base import ContentFile
            json_data_file = ContentFile(request.POST.get('json').encode("utf-8"), name="input.json")

            TestAmpZipFile.objects.create(
                file=json_data_file
            )

        user: User = self.request.user

        token = request.auth
        project: Project = token.project

        try:
            json_data = json.loads(request.POST.get('json'))
        except JSONDecodeError:
            raise AppException('Invalid JSON')

        if user.id is None:
            raise AppException('User not found')
        try:
            job = project.project_jobs.get(git_commit_sha=json_data['head_commit_id'])
        except Job.DoesNotExist:
            raise AppException('Commit hash not found. Make sure you upload mutations before uploading test '
                               'amplification')

        file: InMemoryUploadedFile = request.FILES.get('file')

        if file.content_type != 'application/zip':
            raise AppException('Invalid attached file type. Accepted only zip')

        amplified_test_clases = json_data['amplified_classes']

        zip_file = TestAmpZipFile.objects.create(
            file=file
        )

        for amplified_test_suite in amplified_test_clases:
            test_suite: TestSuite = TestSuite.objects.create(
                job=job,
                name=amplified_test_suite['name'],
                path=amplified_test_suite['amplified_class_address'],
                zipfile=zip_file
            )

            for test_case in amplified_test_suite['amplified_tests']:
                test_case_object = TestCase.objects.create(
                    test_suite=test_suite,
                    test_name=test_case['testname'],
                    test_reference_name=test_case['test_fullname'],
                    file_path=test_case['filename'],
                    start_line=test_case['fromline'],
                    end_line=test_case['toline'],
                    new_coverage=test_case['new_coverage'],
                    original_test=test_case['original_test'],
                )
                test_suite.testcase_set.add(test_case_object)

        return JsonResponse(data={
            'status': True
        }, status=200)
