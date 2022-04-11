from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers

from config.utils import display_source_code
from github_api.utils import get_github_source_code
from job.models import Job, File, Mutation, Project, Profile, ProjectMembership, MutantCoverage
from testamp.models import TestCase, TestSuite


class AmpTestSerializer(serializers.ModelSerializer):
    source_code = serializers.SerializerMethodField()
    original_test = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()

    class Meta:
        model = TestCase
        exclude = ()

    def get_project_id(self, test_case: TestCase):
        project = test_case.test_suite.job.project
        return project.pk

    def get_original_test(self, test_case: TestCase):
        from api.views import TestAmpViewSet
        if 'request' in self.context and 'view' in self.context and type(self.context['view']) is TestAmpViewSet:
            job = test_case.test_suite.job
            project = job.project
            source_code = get_github_source_code(
                project.git_repo_owner,
                project.git_repo_name,
                job.git_commit_sha,
                project.owner.user_profile.access_token,
                test_case.original_test['filename']
            )

            src = source_code['source'].split('\n')[
                  test_case.original_test['fromline'] - 100:test_case.original_test['toline'] - 101]
            source_code['source'] = "\n".join(src)

            test_case.original_test['source_code'] = source_code

        return test_case.original_test

    def get_source_code(self, test_case: TestCase):
        from api.views import TestAmpViewSet
        if 'request' in self.context and 'view' in self.context and type(self.context['view']) is TestAmpViewSet:
            if 'source' in test_case.amplified_test_source and int(test_case.amplified_test_source['total_lines']) > 0:
                return display_source_code(test_case.amplified_test_source['source'], test_case.file_path)
            else:
                return display_source_code(test_case.get_amplified_test_source(), test_case.file_path)
        return None


class MutantCoverageSerializer(serializers.ModelSerializer):
    amplified_tests = serializers.SerializerMethodField()

    class Meta:
        model = MutantCoverage
        exclude = ()

    def get_amplified_tests(self, cov: MutantCoverage):
        job = cov.mutant.file.job
        test_amp_run = job.testsuite_set.all()
        tests_suites = test_amp_run.filter(testcase__original_test__filename=cov.file,
                                           testcase__original_test__testname=cov.test_method_name)

        amp_tests = []

        amp_test_suite: TestSuite
        ids = []
        for amp_test_suite in tests_suites:
            for amp_test in amp_test_suite.testcase_set.filter(original_test__filename=cov.file,
                                                               original_test__testname=cov.test_method_name):
                if amp_test.pk not in ids:
                    ids.append(amp_test.pk)
                    amp_tests.append(amp_test)

        return AmpTestSerializer(amp_tests, many=True, read_only=True, context=self.context).data


class MutationSerializer(serializers.ModelSerializer):
    source_code = serializers.SerializerMethodField()
    covered_by = serializers.SerializerMethodField()

    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)

    def get_covered_by(self, mutant: Mutation):
        return MutantCoverageSerializer(mutant.mutant_coverage, many=True, read_only=True).data

    def get_source_code(self, mutation: Mutation):
        source_code = self.context.get('source_code_str')
        return mutation.get_mutated_source_code(source_code)


class FileSerializer(serializers.ModelSerializer):
    source_code_str = None
    source_code = serializers.SerializerMethodField()
    mutations = serializers.SerializerMethodField()

    def get_mutations(self, obj):
        serializer = MutationSerializer(instance=obj.mutations, read_only=True, many=True,
                                        context={'source_code_str': self.source_code_str})
        return serializer.data

    def get_source_code(self, obj: File):
        self.source_code_str = obj.get_source_code
        if self.source_code_str:
            return self.source_code_str
        return display_source_code(source_code='', file_path=obj.path)

    class Meta:
        model = File
        exclude = ()


class JobSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=False)

    def create(self, validated_data):
        token = self.context['request'].auth
        project = token.project
        validated_data = self.initial_data
        validated_data['project'] = project
        files_data = validated_data.pop('files')
        job = Job.objects.create(**validated_data)
        for file in files_data:
            mutations = file.pop('mutations')
            new_file = File.objects.create(job=job, **file)
            for mutation in mutations:
                try:
                    mutant_coverage = mutation.pop('covered_by')
                except KeyError:
                    mutant_coverage = []
                new_mutation = Mutation.objects.create(file=new_file, **mutation)
                new_file.mutations.add(new_mutation)
                for covered_by in mutant_coverage:
                    new_covered_by = MutantCoverage.objects.create(mutant=new_mutation, **covered_by)
                    new_mutation.mutant_coverage.add(new_covered_by)
            job.files.add(new_file)
        return job

    def validate(self, data):
        return data

    class Meta:
        model = Job
        exclude = ()


class BasicMutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutation
        fields = ('id', 'result')


class BasicFileSerializer(serializers.ModelSerializer):
    total_mutations = serializers.SerializerMethodField()

    def get_total_mutations(self, obj: File):
        return obj.mutations.count()

    class Meta:
        model = File
        exclude = ()


class BasicJobSerializer(serializers.ModelSerializer):
    files = BasicFileSerializer(read_only=True, many=True)

    class Meta:
        model = Job
        exclude = ()


class ListProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ()


class ProjectUserSerializer(serializers.ModelSerializer):
    class Meta:
        exclude = ()
        model = ProjectMembership


class DetailProjectSerializer(serializers.ModelSerializer):
    jobs = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    def get_jobs(self, obj: Project):
        return BasicJobSerializer(instance=obj.project_jobs, many=True, read_only=True).data

    def get_members(self, project: Project):
        return ProjectUserSerializer(project.projectmembership_set.filter(~Q(role='O')), many=True, read_only=True).data

    def get_owner(self, project: Project):
        return ProjectUserSerializer(project.projectmembership_set.get(role='O'), many=False).data

    class Meta:
        model = Project
        exclude = ()


class ProfileSerializer(serializers.ModelSerializer):
    access_token = serializers.SerializerMethodField()

    def get_access_token(self, profile: Profile):
        return len(profile.access_token) > 0

    class Meta:
        model = Profile
        fields = ('access_token',)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('access_token',)


class UserSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(read_only=True, many=False)
    project_owner = ListProjectSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('username', 'id', 'first_name', 'last_name', 'email', 'date_joined', 'last_login', 'user_profile',
                  'project_owner')
