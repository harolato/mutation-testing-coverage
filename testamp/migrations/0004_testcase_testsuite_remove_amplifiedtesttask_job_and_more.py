# Generated by Django 4.0.2 on 2022-03-13 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0003_alter_amplifiedtesttask_completed_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('test_name', models.CharField(max_length=255)),
                ('test_reference_name', models.CharField(max_length=255)),
                ('file_path', models.CharField(max_length=255)),
                ('start_line', models.PositiveIntegerField(default=0, help_text='Start line of original test method. Used for replacing old test with new')),
                ('end_line', models.IntegerField(default=0, help_text='End line of original test method. Used for replacing old test with new')),
                ('new_coverage', models.JSONField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TestSuite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('path', models.CharField(max_length=255)),
                ('source_code_file', models.FileField(upload_to='testamp_zipfiles/')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='amplifiedtesttask',
            name='job',
        ),
        migrations.DeleteModel(
            name='AmplifiedTest',
        ),
        migrations.DeleteModel(
            name='AmplifiedTestTask',
        ),
    ]
