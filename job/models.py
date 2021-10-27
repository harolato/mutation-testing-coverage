from django.db import models


# Create your models here.
from config.utils import Timestampable


class Job(Timestampable):
    git_commit_sha = models.CharField(max_length=255)
    service_name = models.CharField(max_length=255)
    service_job_id = models.CharField(max_length=255)
    test_cases = models.JSONField(null=True, blank=True, default=dict)

    class Meta:
        db_table = 'job'


class File(Timestampable):
    hash = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

    job = models.ForeignKey('Job', related_name='files', on_delete=models.CASCADE, null=True)
    # mutations = models.ForeignKey('Mutation', on_delete=models.CASCADE)

    class Meta:
        db_table = 'file'


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

    class Meta:
        db_table = 'mutation'
