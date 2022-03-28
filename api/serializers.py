from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers
from job.models import Job, File, Mutation, Project, Profile, ProjectMembership, MutantCoverage
from testamp.models import TestCase, TestSuite


class AmpTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        exclude = ()


class MutantCoverageSerializer(serializers.ModelSerializer):
    amplified_tests = serializers.SerializerMethodField()

    class Meta:
        model = MutantCoverage
        exclude = ()

    def get_amplified_tests(self, cov: MutantCoverage):
        job = cov.mutant.file.job
        test_amp_run = job.testsuite_set.all()
        tests_suites = test_amp_run.filter(testcase__original_test__filename=cov.file)

        amp_tests = []

        amp_test_suite: TestSuite
        for amp_test_suite in tests_suites:
            for amp_test in amp_test_suite.testcase_set.filter(original_test__filename=cov.file):
                amp_tests.append(amp_test)
        return AmpTestSerializer(amp_tests, many=True, read_only=True).data


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
        return ""

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
