# Generated by Django 4.0.2 on 2022-04-07 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0012_testcase_amplified_test_source'),
    ]

    operations = [
        migrations.AddField(
            model_name='testcase',
            name='evaluation_workflow_data',
            field=models.JSONField(default=dict),
        ),
    ]
