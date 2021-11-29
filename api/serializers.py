from rest_framework import serializers
import requests
from rest_framework.response import Response

from job.models import Job, File, Mutation, Project


def get_source_code(file):
    """
    Fetch source code from github
    """
    job = file.job
    project = job.project
    url = f"https://raw.githubusercontent.com/{project.git_repo_owner}/{project.git_repo_name}/{job.git_commit_sha}/{file.path}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.content.decode("utf-8")
    return False


class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)


class FileSerializer(serializers.ModelSerializer):
    mutations = serializers.SerializerMethodField()
    source_code = serializers.SerializerMethodField()

    def get_mutations(self, object: File):
        source_code = get_source_code(object)
        split_source = source_code.split('\n')
        mutations = []
        for mutation in object.mutations.all():
            split_source[mutation.start_line - 1] = mutation.mutated_source_code
            mutation.mutated_source_code = "\n".join(split_source)
            mutations.append(mutation)
        return MutationSerializer(mutations, read_only=True, many=True).data

    def get_source_code(self, obj: File):
        source_code = get_source_code(obj)
        if source_code is not False:
            return {
                'source': source_code,
                'total_lines': source_code.count("\n")
            }
        return ""

    class Meta:
        model = File
        exclude = ()


class BasicJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ()


class JobSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=False)

    def create(self, validated_data):
        token = self.context['request'].auth
        project = token.project
        validated_data['project'] = project
        files_data = validated_data.pop('files')
        job = Job.objects.create(**validated_data)
        for file in files_data:
            mutations = file.pop('mutations')
            new_file = File.objects.create(job=job, **file)
            for mutation in mutations:
                new_mutation = Mutation.objects.create(file=new_file, **mutation)
                new_file.mutations.add(new_mutation)
            job.files.add(new_file)
        return job

    class Meta:
        model = Job
        exclude = ()


class ProjectSerializer(serializers.ModelSerializer):
    job_project = BasicJobSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'
