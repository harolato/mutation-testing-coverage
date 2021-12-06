import base64
import hashlib
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from config.utils import Timestampable


class Project(Timestampable):
    name = models.CharField(max_length=255, blank=True)
    description = models.CharField(max_length=255, blank=True)
    git_repo_owner = models.CharField(max_length=255, blank=True)
    git_repo_name = models.CharField(max_length=255, blank=True)
    users = models.ManyToManyField(User, related_name='project_users', through='ProjectMembership')

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
    project = models.OneToOneField(Project, related_name='project_tokens', on_delete=models.CASCADE)
    user = models.OneToOneField(User, related_name='user_tokens', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    token = models.TextField(blank=True)
    expire_at = models.DateTimeField(default=timezone.now() + timedelta(days=60))

    def save(self, *args, **kwargs):
        if not self.pk:
            key_string = bytes(datetime.now().strftime("%c") + str(self.user.id) + str(self.project.id),
                               encoding='utf8')
            self.token = hashlib.sha256(base64.standard_b64encode(key_string)).hexdigest()
        super(Token, self).save(*args, **kwargs)

    class Meta:
        db_table = 'project_token'


class Job(Timestampable):
    git_commit_sha = models.CharField(max_length=255)
    service_name = models.CharField(max_length=255)
    service_job_id = models.CharField(max_length=255)
    test_cases = models.JSONField(null=True, blank=True, default=list)

    project = models.ForeignKey(Project, related_name='project_jobs', on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'job'

    def __str__(self):
        return self.git_commit_sha


class File(Timestampable):
    hash = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

    job = models.ForeignKey('Job', related_name='files', on_delete=models.CASCADE, null=True)

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
    result = models.CharField(max_length=2, choices=[
        ('S', 'Survived'),
        ('K', 'Killed'),
        ('I', 'Inconsistent'),
    ], default='I')

    file = models.ForeignKey('File', related_name='mutations', on_delete=models.CASCADE)

    @property
    def reactions(self):
        return Reaction.objects.filter(entity_type=self.__class__.__name__, entity_id=self.id)

    @property
    def reactions_grouped(self):
        q = Reaction.objects.filter(entity_type=self.__class__.__name__, entity_id=self.id)
        return q

    class Meta:
        db_table = 'mutation'


class Reaction(Timestampable):
    entity_type = models.CharField(blank=True, max_length=255)
    entity_id = models.IntegerField(null=True)
    user = models.ForeignKey(User, related_name='user_reaction', on_delete=models.DO_NOTHING)
    result = models.CharField(max_length=2, choices=[
        ('L', 'Like'),
        ('D', 'Dislike'),
        ('I', 'Ignore'),
    ], default='I')

    class Meta:
        db_table = 'reaction'


class Profile(Timestampable):
    access_token = models.CharField(blank=True, max_length=255)
    user = models.OneToOneField(User, related_name='user_profile', on_delete=models.CASCADE)

    class Meta:
        db_table = 'user_profile'
