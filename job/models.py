import base64
import hashlib
import os
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from config.utils import Timestampable
import requests
import json
import re


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


class Project(Timestampable):
    name = models.CharField(max_length=255, blank=True)
    description = models.CharField(max_length=255, blank=True)
    git_repo_owner = models.CharField(max_length=255, blank=True)
    git_repo_name = models.CharField(max_length=255, blank=True)
    users = models.ManyToManyField(User, related_name='project_users', through='ProjectMembership')

    def get_owner(self):
        return self.users.filter(projectmembership__role='O').first()

    class Meta:
        db_table = 'project'

    def __str__(self):
        return self.name


class ProjectMembership(Timestampable):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=2, choices=[
        ('O', 'Owner'),
        ('M', 'Member'),
    ], default='M')

    class Meta:
        db_table = 'project_user'


class Token(Timestampable):
    name = models.CharField(max_length=255)
    token = models.TextField(blank=True)
    expire_at = models.DateTimeField(default=timezone.now() + timedelta(days=60))

    project = models.ForeignKey(Project, unique=False, related_name='project_tokens', on_delete=models.CASCADE)
    user = models.ForeignKey(User, unique=False, related_name='user_tokens', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.pk:
            key_string = bytes(datetime.now().strftime("%c") + str(self.user.id) + str(self.project.id),
                               encoding='utf8')
            self.token = hashlib.sha256(base64.standard_b64encode(key_string)).hexdigest()
        super(Token, self).save(*args, **kwargs)

    class Meta:
        db_table = 'project_token'


class Job(Timestampable):
    git_commit_sha = models.CharField(max_length=255, blank=True)
    service_name = models.CharField(max_length=255, blank=True)
    service_job_id = models.CharField(max_length=255, blank=True)
    test_cases = models.JSONField(null=True, blank=True, default=list)
    github_issue_id = models.IntegerField(blank=True, default=None, null=True)

    project = models.ForeignKey(Project, related_name='project_jobs', on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'job'

    def __str__(self):
        return self.git_commit_sha


class File(Timestampable):
    hash = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

    job = models.ForeignKey('Job', related_name='files', on_delete=models.CASCADE, null=True)

    @property
    def get_source_code(self):
        """
        Fetch source code from github
        """
        job = self.job
        project = job.project
        url = f"https://raw.githubusercontent.com/{project.git_repo_owner}/{project.git_repo_name}/{job.git_commit_sha}/{self.path}"

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

    class Meta:
        db_table = 'file'

    def __str__(self):
        return self.path


class Mutation(Timestampable):
    sequence_number = models.IntegerField()
    description = models.TextField()
    start_line = models.IntegerField()
    end_line = models.IntegerField()
    mutated_source_code = models.TextField()
    status = models.IntegerField(blank=True, null=True, default=0, choices=[
        (0, 'None'),
        (1, 'Fix'),
        (2, 'Ignore'),
    ])

    github_issue_comment_id = models.IntegerField(blank=True, null=True, default=None)
    result = models.CharField(max_length=2, choices=[
        ('S', 'Survived'),
        ('K', 'Killed'),
        ('I', 'Inconsistent'),
    ], default='I')

    file = models.ForeignKey('File', related_name='mutations', on_delete=models.CASCADE)

    def get_mutated_source_code(self, source_code=None):
        if source_code is None:
            source_code = {}
        if "source" not in source_code:
            source_code = self.file.get_source_code
        split_source = []
        if source_code:
            split_source = source_code['source'].split('\n')
        try:
            tmp_src = source_code.copy()
            tmp_src['changed'] = []
            start_line = self.start_line - 1  # starts counting from zero
            if self.end_line > self.start_line:
                # Split source code string into array
                mutated_source_array = self.mutated_source_code.split('\n')

                # Inclusive diff
                diff = self.end_line - self.start_line + 1
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
                split_source[start_line] = self.mutated_source_code
            tmp_src['source'] = "\n".join(split_source)
        except IndexError:
            return ""
        return tmp_src

    class Meta:
        db_table = 'mutation'


class Profile(Timestampable):
    access_token = models.CharField(blank=True, max_length=255)
    user = models.OneToOneField(User, related_name='user_profile', on_delete=models.CASCADE)

    class Meta:
        db_table = 'user_profile'


class MutantCoverage(Timestampable):
    test_method_name = models.CharField(blank=True, max_length=255)
    file = models.CharField(blank=True, max_length=255)
    line = models.IntegerField(blank=True)
    level = models.IntegerField(default=0, choices=[
        (1, 'Method Covered'),
        (2, 'Node Covered'),
        (3, 'Infected'),
        (4, 'Propagated'),
        (5, 'Revealed'),
    ])

    mutant = models.ForeignKey(Mutation, related_name='mutant_coverage', on_delete=models.CASCADE)

    class Meta:
        db_table = 'mutant_coverage'
