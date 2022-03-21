# Create your views here.
import json
import logging
from difflib import context_diff, unified_diff
from json import JSONDecodeError

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
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
from job.models import Job, File, Mutation, Project, Profile, MutantCoverage
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
            errors.append('Mutation not found')

        try:
            gh = Github(login_or_token=user.user_profile.access_token)
            gh_login = gh.get_user().login
        except BadCredentialsException:
            errors.append('Invalid Github Access Token')

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

            markdown = "\n"
            markdown += "```...NOTES HERE...```"
            markdown += "\n\n"
            markdown += f"[Open Mutant in Visualiser tool]({mutant_url})\n\n"
            markdown += "\n\n"
            markdown += f"```{mutant.description}```"
            markdown += "\n\n"
            markdown += f"https://github.com/{mutant.file.job.project.git_repo_owner}/{mutant.file.job.project.git_repo_name}/blob/{mutant.file.job.git_commit_sha}/{mutant.file.path}#L{mutant.start_line}"
            markdown += "\n\n```diff\n" + "\n".join(diff_string) + "\n```"

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
        return Response(data={'errors': errors}, status=400)

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
            errors.append('Invalid Github Access Token')

        if user.id is None:
            errors.append('User not found')
        if kwargs['mutant_id'] is None:
            errors.append('Mutation ID missing')
        try:
            mutant = Mutation.objects.get(pk=kwargs['mutant_id'])
        except ObjectDoesNotExist:
            errors.append('Mutation not found')

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
                return Response(data={'error': 'Failed to create Issue. Try again later: ' + error.__str__()},
                                status=400)
            return Response(
                data={'issue_url': gh_issue.html_url, 'issue_id': gh_issue.number},
                status=200)
        return Response(data={'error': errors}, status=400)


def json_response_exception():
    def decorate(func):
        def applicator(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except AppException as e:
                return JsonResponse(data={
                    "status": False,
                    "error": str(e)
                }, status=400)

        return applicator

    return decorate

class AppException(Exception):
    pass


class SubmitTestAmpView(APIView):
    authentication_classes = (SessionAuthentication, SimpleTokenAuth)
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @json_response_exception()
    def post(self, request: HttpRequest, *args, **kwargs):
        if not request.POST.get('json') or not request.FILES.get('file'):
            raise AppException('Missing Field')

        user: User = self.request.user

        token = request.auth
        project: Project = token.project

        try:
            json_data = json.loads(request.POST.get('json'))
        except JSONDecodeError:
            raise AppException('Invalid JSON')

        if user.id is None:
            raise AppException('User not found')

        job = project.project_jobs.latest('created_at')

        if request.GET.get('job_id'):
            job = project.project_jobs.get(request.GET.get('job_id'))

        file: InMemoryUploadedFile = request.FILES.get('file')

        if file.content_type != 'application/zip':
            raise AppException('Invalid attached file type. Accepted only zip')

        zip_file = TestAmpZipFile.objects.create(
            job=job,
            file=file
        )

        amplified_test_clases = json_data['amplified_classes']

        for amplified_test_suite in amplified_test_clases:
            test_suite: TestSuite = TestSuite.objects.create(
                job=job,
                name=amplified_test_suite['name'],
                path=amplified_test_suite['amplified_class_address'],
                test_amp_zip_file=zip_file
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
