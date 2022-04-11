# Generated by Django 4.0.2 on 2022-04-11 12:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('testamp', '0014_testcase_evaluation_workflow_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='testcase',
            name='pull_request_created_by',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='testcase',
            name='pull_request_data',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='testcase',
            name='pull_request_id',
            field=models.PositiveIntegerField(default=None, null=True),
        ),
    ]
