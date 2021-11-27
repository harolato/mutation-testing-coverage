from rest_framework import serializers
import requests
from job.models import Job, File, Mutation, Project


class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)


class FileSerializer(serializers.ModelSerializer):
    mutations = MutationSerializer(many=True, read_only=False)
    source_code = serializers.SerializerMethodField()

    def get_source_code(self, obj: File):
        job = obj.job
        project = job.project
        url = f"https://raw.githubusercontent.com/{project.git_repo_owner}/{project.git_repo_name}/{job.git_commit_sha}/{obj.path}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.content
        return ''

    class Meta:
        model = File
        exclude = ()


# class JobFileSerializer(serializers.ModelSerializer):
#     href =
#
#     class Meta:
#         model = File
#         exclude = ()


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
