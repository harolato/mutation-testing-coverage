# Generated by Django 4.0.2 on 2022-03-21 14:07

from django.db import migrations, models
import testamp.models


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0008_rename_source_code_file_testsuite_test_amp_zip_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testampzipfile',
            name='file',
            field=models.FileField(upload_to=testamp.models.zip_file_path),
        ),
    ]
