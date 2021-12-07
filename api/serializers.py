import json
import os.path
import re

from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers
import requests

from job.models import Job, File, Mutation, Project, Reaction, Profile, ProjectMembership


def get_file_source_language(url):
    json_file = open(os.path.dirname(__file__) + '/../storage/monaco_languages.json')
    data = json.load(json_file)
    json_file.close()
    extension = re.search(r"^.*(\..*)$", url)
    if extension:
        url_extension = extension.group(1)
        for file_type in data:
            for file_extension in file_type['extensions']:
                if file_extension == url_extension:
                    return file_type
    return data[0]


def get_source_code(file: File):
    """
    Fetch source code from github
    """
    job = file.job
    project = job.project
    url = f"https://raw.githubusercontent.com/{project.git_repo_owner}/{project.git_repo_name}/{job.git_commit_sha}/{file.path}"

    response = requests.get(url)
    if response.status_code == 200:
        source_code = response.content.decode("utf-8")
        return {
            "source": source_code,
            "total_lines": source_code.count("\n"),
            "file_type": get_file_source_language(url),
        }
    return {
        "source": "",
        "total_lines": 0,
        "file_type": get_file_source_language(url),
    }


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        exclude = ('user',)


class MutationSerializer(serializers.ModelSerializer):
    source_code = serializers.SerializerMethodField()

    # reactions = serializers.SerializerMethodField()

    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)

    # def get_reactions(self, mutation: Mutation):
    #     a = mutation.reactions_grouped.values('result')
    #     return ReactionSerializer(mutation.reactions).data

    def get_source_code(self, mutation: Mutation):
        source_code = self.context.get('source_code_str')
        if source_code is None:
            source_code = get_source_code(mutation.file)
        split_source = []
        if source_code:
            split_source = source_code['source'].split('\n')
        try:
            tmp_src = source_code.copy()
            tmp_src['changed'] = []
            start_line = mutation.start_line - 1  # starts counting from zero
            if mutation.end_line > mutation.start_line:
                # Split source code string into array
                mutated_source_array = mutation.mutated_source_code.split('\n')

                # Inclusive diff
                diff = mutation.end_line - mutation.start_line + 1
                for line_no in range(diff):
                    if len(mutated_source_array) - 1 < line_no:  # If we cannot map any mutated source to the line,
                        # remove the line
                        del split_source[start_line + line_no]
                        continue
                    # Logic to copy indentations from line that we're replacing
                    to_replace = mutated_source_array[line_no].lstrip()
                    tab_count = split_source[start_line + line_no].count('\t')
                    for i in range(tab_count):
                        to_replace = '\t' + to_replace
                    # ---

                    # Replace the line
                    split_source[start_line + line_no] = to_replace
            else:
                split_source[start_line] = mutation.mutated_source_code
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
                new_mutation = Mutation.objects.create(file=new_file, **mutation)
                new_file.mutations.add(new_mutation)
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
        exclude = ()


class UserSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(read_only=True, many=False)
    project_owner = ListProjectSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('username', 'id', 'first_name', 'last_name', 'email', 'date_joined', 'last_login', 'user_profile',
                  'project_owner')
