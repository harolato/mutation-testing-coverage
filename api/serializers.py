from rest_framework import serializers
import requests

from job.models import Job, File, Mutation, Project


def get_source_code(file: File):
    """
    Fetch source code from github
    """
    job = file.job
    project = job.project
    url = f"https://raw.githubusercontent.com/{project.git_repo_owner}/{project.git_repo_name}/{job.git_commit_sha}/{file.path}"
    # mime = MimeTypes()
    response = requests.get(url)
    if response.status_code == 200:
        source_code = response.content.decode("utf-8")
        return {
            "source": source_code,
            "total_lines": source_code.count("\n"),
            # "mime_type": mime.guess_type(url),
            # "url": url
        }
    return False


class MutationSerializer(serializers.ModelSerializer):
    source_code = serializers.SerializerMethodField()

    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)

    def get_source_code(self, mutation: Mutation):
        source_code = self.context.get('source_code_str')
        split_source = []
        if source_code:
            split_source = source_code['source'].split('\n')
        try:
            split_source[mutation.start_line - 1] = mutation.mutated_source_code
            tmp_src = source_code
            tmp_src['source'] = "\n".join(split_source)
        except IndexError:
            return ""
        return tmp_src


class FileSerializer(serializers.ModelSerializer):
    source_code_str = None
    source_code = serializers.SerializerMethodField()
    mutations = serializers.SerializerMethodField()

    def get_mutations(self, obj):
        serializer = MutationSerializer(instance=obj.mutations, read_only=True, many=True,
                                        context={'source_code_str': self.source_code_str})
        return serializer.data

    def get_source_code(self, obj: File):
        self.source_code_str = get_source_code(obj)
        if self.source_code_str:
            return self.source_code_str
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
        depth = 1
        exclude = ()


class ProjectSerializer(serializers.ModelSerializer):
    job_project = BasicJobSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'
