# Generated by Django 3.2.8 on 2021-12-08 20:08

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0018_auto_20211208_2103'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='github_issue_id',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='git_commit_sha',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='job',
            name='service_job_id',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='job',
            name='service_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 6, 20, 8, 43, 143130, tzinfo=utc)),
        ),
    ]