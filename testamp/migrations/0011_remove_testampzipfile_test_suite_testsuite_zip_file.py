# Generated by Django 4.0.2 on 2022-03-28 09:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0010_remove_testampzipfile_job_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testampzipfile',
            name='test_suite',
        ),
        migrations.AddField(
            model_name='testsuite',
            name='zip_file',
            field=models.OneToOneField(default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='testamp.testampzipfile'),
        ),
    ]